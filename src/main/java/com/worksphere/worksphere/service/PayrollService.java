package com.worksphere.worksphere.service;

import com.worksphere.worksphere.entity.Payroll;
import com.worksphere.worksphere.repository.PayrollRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;

    public PayrollService(PayrollRepository payrollRepository) {
        this.payrollRepository = payrollRepository;
    }

    public Payroll savePayroll(Payroll payroll) {

        double netSalary =
                payroll.getBasicSalary()
                        + payroll.getHra()
                        + payroll.getAllowances()
                        - payroll.getDeductions();

        payroll.setNetSalary(netSalary);

        return payrollRepository.save(payroll);
    }

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id).orElse(null);
    }

    public List<Payroll> getPayrollsByEmployeeId(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    public void deletePayroll(Long id) {
        payrollRepository.deleteById(id);
    }
}