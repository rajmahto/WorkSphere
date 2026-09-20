package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.entity.LeaveBalance;
import com.worksphere.worksphere.repository.EmployeeRepository;
import com.worksphere.worksphere.service.LeaveBalanceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-balances")
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;
    private final EmployeeRepository employeeRepository;

    public LeaveBalanceController(
            LeaveBalanceService leaveBalanceService,
            EmployeeRepository employeeRepository) {

        this.leaveBalanceService = leaveBalanceService;
        this.employeeRepository = employeeRepository;
    }

    // =========================
    // HR / ADMIN
    // =========================

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @PostMapping
    public LeaveBalance createLeaveBalance(
            @RequestBody LeaveBalance leaveBalance) {

        return leaveBalanceService.createLeaveBalance(leaveBalance);
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping
    public List<LeaveBalance> getAllLeaveBalances() {

        return leaveBalanceService.getAllLeaveBalances();
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping("/{id}")
    public LeaveBalance getLeaveBalanceById(
            @PathVariable Long id) {

        return leaveBalanceService.getLeaveBalanceById(id);
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteLeaveBalance(
            @PathVariable Long id) {

        leaveBalanceService.deleteLeaveBalance(id);
    }

    // =========================
    // EMPLOYEE
    // =========================

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my")
    public List<LeaveBalance> getMyLeaveBalances(
            Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        return leaveBalanceService
                .getLeaveBalancesByEmployeeId(employee.getId());
    }
}