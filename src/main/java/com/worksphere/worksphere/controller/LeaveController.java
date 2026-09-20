package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.entity.Leave;
import com.worksphere.worksphere.repository.EmployeeRepository;
import com.worksphere.worksphere.service.LeaveService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    public LeaveController(LeaveService leaveService,
                           EmployeeRepository employeeRepository) {
        this.leaveService = leaveService;
        this.employeeRepository = employeeRepository;
    }

    // ==================== EMPLOYEE ====================

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/my")
    public Leave applyMyLeave(
            @RequestBody Leave leave,
            Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        leave.setEmployee(employee);

        return leaveService.applyLeave(leave);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my")
    public List<Leave> getMyLeaves(Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        return leaveService.getLeavesByEmployeeId(employee.getId());
    }

    // ==================== HR / ADMIN ====================

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping("/pending")
    public List<Leave> getPendingLeaves() {
        return leaveService.getPendingLeaves();
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping("/{id}")
    public Leave getLeaveById(@PathVariable Long id) {
        return leaveService.getLeaveById(id);
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteLeave(@PathVariable Long id) {
        leaveService.deleteLeave(id);
        return "Leave deleted successfully";
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @PutMapping("/{id}/approve")
    public Leave approveLeave(@PathVariable Long id) {
        return leaveService.approveLeave(id);
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @PutMapping("/{id}/reject")
    public Leave rejectLeave(@PathVariable Long id) {
        return leaveService.rejectLeave(id);
    }
}