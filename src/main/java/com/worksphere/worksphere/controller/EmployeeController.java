package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.dto.EmployeeRequest;
import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.repository.EmployeeRepository;
import com.worksphere.worksphere.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;

    public EmployeeController(
            EmployeeService employeeService,
            EmployeeRepository employeeRepository) {

        this.employeeService = employeeService;
        this.employeeRepository = employeeRepository;
    }


    // =========================
    // HR / ADMIN
    // =========================

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PostMapping
    public Employee createEmployee(
            @Valid @RequestBody EmployeeRequest request) {

        return employeeService.saveEmployee(request);
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping
    public List<Employee> getAllEmployees() {

        return employeeService.getAllEmployees();
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping("/{id}")
    public Employee getEmployeeById(
            @PathVariable Long id) {

        return employeeService.getEmployeeById(id);
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return employeeService.updateEmployee(
                id,
                employee
        );
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return "Employee deleted successfully";
    }


    // =========================
    // EMPLOYEE
    // =========================

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my")
    public Employee getMyEmployeeDetails(
            Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException(
                    "Employee not found"
            );
        }

        return employee;
    }
}