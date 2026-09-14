package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.entity.Attendance;
import com.worksphere.worksphere.service.AttendanceService;
import org.springframework.web.bind.annotation.*;
import com.worksphere.worksphere.entity.Employee;
import com.worksphere.worksphere.repository.EmployeeRepository;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final EmployeeRepository employeeRepository;

    public AttendanceController(AttendanceService attendanceService,
                                EmployeeRepository employeeRepository) {
        this.attendanceService = attendanceService;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping
    public Attendance saveAttendance(@RequestBody Attendance attendance) {
        return attendanceService.saveAttendance(attendance);
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }


    @GetMapping("/{id}")
    public Attendance getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return "Attendance deleted successfully";
    }
    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getAttendanceByEmployeeId(@PathVariable Long employeeId) {
        return attendanceService.getAttendanceByEmployeeId(employeeId);
    }
    @GetMapping("/my")
    public List<Attendance> getMyAttendance(Authentication authentication) {

        String email = authentication.getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElse(null);

        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        return attendanceService.getAttendanceByEmployeeId(employee.getId());
    }
}