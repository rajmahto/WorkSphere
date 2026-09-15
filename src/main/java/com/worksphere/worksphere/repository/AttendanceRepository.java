package com.worksphere.worksphere.repository;

import com.worksphere.worksphere.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeId(Long employeeId);

    List<Attendance> findByEmployeeIdAndDateOrderByCheckInDesc(
            Long employeeId,
            LocalDate date
    );
}