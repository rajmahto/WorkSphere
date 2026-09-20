package com.worksphere.worksphere.service;

import com.worksphere.worksphere.entity.Attendance;
import com.worksphere.worksphere.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public Attendance saveAttendance(Attendance attendance) {

        if (attendance.getEmployee() == null) {
            throw new RuntimeException("Employee is required");
        }

        LocalDate today = LocalDate.now();

        List<Attendance> todayAttendance =
                attendanceRepository
                        .findByEmployeeIdAndDateOrderByCheckInDesc(
                                attendance.getEmployee().getId(),
                                today
                        );

        if (!todayAttendance.isEmpty()) {
            throw new RuntimeException(
                    "Attendance already marked for today"
            );
        }

        attendance.setDate(today);

        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(Long employeeId) {

        LocalDate today = LocalDate.now();

        List<Attendance> todayAttendance =
                attendanceRepository
                        .findByEmployeeIdAndDateOrderByCheckInDesc(
                                employeeId,
                                today
                        );

        if (todayAttendance.isEmpty()) {
            throw new RuntimeException(
                    "Please check in first"
            );
        }

        // Latest check-in record
        Attendance attendance = todayAttendance.get(0);

        if (attendance.getCheckOut() != null) {
            throw new RuntimeException(
                    "You have already checked out"
            );
        }

        LocalDateTime checkOut = LocalDateTime.now();

        attendance.setCheckOut(checkOut);

        long workingMinutes =
                java.time.Duration
                        .between(
                                attendance.getCheckIn(),
                                checkOut
                        )
                        .toMinutes();

        attendance.setWorkingMinutes(workingMinutes);

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {
        return attendanceRepository
                .findById(id)
                .orElse(null);
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    public List<Attendance> getAttendanceByEmployeeId(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }
}