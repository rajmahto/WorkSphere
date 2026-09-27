package com.worksphere.worksphere.service;

import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.entity.LeaveBalance;
import com.worksphere.worksphere.repository.EmployeeRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.worksphere.worksphere.entity.Payroll;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiAssistantService {

    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceService leaveBalanceService;
    private final GeminiService geminiService;
    private final PayrollService payrollService;

    public AiAssistantService(
            EmployeeRepository employeeRepository,
            LeaveBalanceService leaveBalanceService,
            GeminiService geminiService,PayrollService payrollService) {

        this.employeeRepository = employeeRepository;
        this.leaveBalanceService = leaveBalanceService;
        this.geminiService = geminiService;
        this.payrollService = payrollService;
    }

    public Map<String, Object> getEmployeeContext(
            Authentication authentication) {

        String email = authentication.getName();

        Employee employee =
                employeeRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"
                                )
                        );

        List<LeaveBalance> balances =
                leaveBalanceService
                        .getLeaveBalancesByEmployeeId(
                                employee.getId()
                        );

        List<Map<String, Object>> leaveBalances =
                balances.stream()
                        .map(balance -> {

                            Map<String, Object> data =
                                    new LinkedHashMap<>();

                            data.put(
                                    "leaveType",
                                    balance.getLeaveType()
                            );

                            data.put(
                                    "totalLeaves",
                                    balance.getTotalLeaves()
                            );

                            data.put(
                                    "usedLeaves",
                                    balance.getUsedLeaves()
                            );

                            data.put(
                                    "remainingLeaves",
                                    balance.getRemainingLeaves()
                            );

                            return data;
                        })
                        .toList();


        List<Payroll> payrolls =
                payrollService.getPayrollsByEmployeeId(
                        employee.getId()
                );

        List<Map<String, Object>> payrollDetails =
                payrolls.stream()
                        .map(payroll -> {

                            Map<String, Object> data =
                                    new LinkedHashMap<>();

                            data.put("month", payroll.getMonth());
                            data.put("year", payroll.getYear());
                            data.put("basicSalary", payroll.getBasicSalary());
                            data.put("hra", payroll.getHra());
                            data.put("allowances", payroll.getAllowances());
                            data.put("deductions", payroll.getDeductions());
                            data.put("netSalary", payroll.getNetSalary());

                            return data;
                        })
                        .toList();

        Map<String, Object> context =
                new LinkedHashMap<>();

        context.put(
                "employeeName",
                employee.getName()
        );

        context.put(
                "email",
                employee.getEmail()
        );

        context.put(
                "leaveBalances",
                leaveBalances
        );

        context.put(
                "payrollDetails",
                payrollDetails
        );

        return context;
    }

    public String chatWithHrAssistant(
            Authentication authentication,
            String userMessage) {

        Map<String, Object> context =
                getEmployeeContext(authentication);

        String employeeContext = context.toString();

        return geminiService.askHrAssistant(
                employeeContext,
                userMessage
        );
    }

}