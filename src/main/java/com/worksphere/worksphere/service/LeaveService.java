package com.worksphere.worksphere.service;

import com.worksphere.worksphere.entity.Leave;
import com.worksphere.worksphere.repository.LeaveRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveBalanceService leaveBalanceService;

    public LeaveService(LeaveRepository leaveRepository,
                        LeaveBalanceService leaveBalanceService) {
        this.leaveRepository = leaveRepository;
        this.leaveBalanceService = leaveBalanceService;
    }

    public Leave applyLeave(Leave leave) {

        leave.setStatus("PENDING");

        return leaveRepository.save(leave);
    }

    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public List<Leave> getPendingLeaves() {
        return leaveRepository.findByStatus("PENDING");
    }

    public Leave getLeaveById(Long id) {
        return leaveRepository.findById(id).orElse(null);
    }

    public void deleteLeave(Long id) {
        leaveRepository.deleteById(id);
    }

    @Transactional
    public Leave approveLeave(Long id) {

        Leave leave = leaveRepository.findById(id).orElse(null);

        if (leave == null) {
            return null;
        }

        if (!"PENDING".equals(leave.getStatus())) {
            throw new RuntimeException(
                    "Only pending leave can be approved"
            );
        }

        long days = ChronoUnit.DAYS.between(
                leave.getStartDate(),
                leave.getEndDate()
        ) + 1;

        leaveBalanceService.deductLeave(
                leave.getEmployee().getId(),
                leave.getLeaveType(),
                (int) days
        );

        leave.setStatus("APPROVED");

        return leaveRepository.save(leave);
    }

    public Leave rejectLeave(Long id) {

        Leave leave = leaveRepository.findById(id).orElse(null);

        if (leave == null) {
            return null;
        }

        if (!"PENDING".equals(leave.getStatus())) {
            throw new RuntimeException(
                    "Only pending leave can be rejected"
            );
        }

        leave.setStatus("REJECTED");

        return leaveRepository.save(leave);
    }
    public List<Leave> getLeavesByEmployeeId(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }
}