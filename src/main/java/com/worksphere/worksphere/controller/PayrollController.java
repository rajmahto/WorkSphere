package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.entity.Payroll;
import com.worksphere.worksphere.service.PayrollService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.worksphere.worksphere.repository.EmployeeRepository;

import java.util.List;

@RestController
@RequestMapping("/payrolls")
public class PayrollController {

    private final PayrollService payrollService;
    private final EmployeeRepository employeeRepository;

    public PayrollController(PayrollService payrollService,
                             EmployeeRepository employeeRepository) {
        this.payrollService = payrollService;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public Payroll savePayroll(@RequestBody Payroll payroll) {
        return payrollService.savePayroll(payroll);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<Payroll> getMyPayrolls(Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        return payrollService.getPayrollsByEmployeeId(employee.getId());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public Payroll getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public String deletePayroll(@PathVariable Long id) {
        payrollService.deletePayroll(id);
        return "Payroll deleted successfully";
    }
}