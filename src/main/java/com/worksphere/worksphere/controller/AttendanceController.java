package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.entity.Attendance;
import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.repository.EmployeeRepository;
import com.worksphere.worksphere.service.AttendanceService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final EmployeeRepository employeeRepository;

    public AttendanceController(
            AttendanceService attendanceService,
            EmployeeRepository employeeRepository) {

        this.attendanceService = attendanceService;
        this.employeeRepository = employeeRepository;
    }

    // =========================
    // HR / ADMIN
    // =========================

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @PostMapping
    public Attendance saveAttendance(
            @RequestBody Attendance attendance) {

        return attendanceService.saveAttendance(attendance);
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping("/{id}")
    public Attendance getAttendanceById(
            @PathVariable Long id) {

        return attendanceService.getAttendanceById(id);
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return "Attendance deleted successfully";
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getAttendanceByEmployeeId(
            @PathVariable Long employeeId) {

        return attendanceService
                .getAttendanceByEmployeeId(employeeId);
    }

    // =========================
    // EMPLOYEE
    // =========================

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my")
    public List<Attendance> getMyAttendance(
            Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        return attendanceService
                .getAttendanceByEmployeeId(employee.getId());
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/my")
    public Attendance markMyAttendance(
            Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setDate(java.time.LocalDate.now());
        attendance.setCheckIn(java.time.LocalDateTime.now());
        attendance.setStatus("PRESENT");

        return attendanceService.saveAttendance(attendance);
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/my/checkout")
    public Attendance checkOut(
            Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        return attendanceService.checkOut(employee.getId());
    }
}