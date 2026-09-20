package com.worksphere.worksphere.service;

import com.worksphere.worksphere.entity.LeaveBalance;
import com.worksphere.worksphere.repository.LeaveBalanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveBalanceService(
            LeaveBalanceRepository leaveBalanceRepository) {

        this.leaveBalanceRepository = leaveBalanceRepository;
    }


    // =========================
    // HR / ADMIN
    // =========================

    public LeaveBalance createLeaveBalance(
            LeaveBalance leaveBalance) {

        return leaveBalanceRepository.save(leaveBalance);
    }


    public List<LeaveBalance> getAllLeaveBalances() {

        return leaveBalanceRepository.findAll();
    }


    public LeaveBalance getLeaveBalanceById(Long id) {

        return leaveBalanceRepository
                .findById(id)
                .orElse(null);
    }


    public void deleteLeaveBalance(Long id) {

        leaveBalanceRepository.deleteById(id);
    }


    // =========================
    // EMPLOYEE
    // =========================

    public List<LeaveBalance> getLeaveBalancesByEmployeeId(
            Long employeeId) {

        return leaveBalanceRepository
                .findAll()
                .stream()
                .filter(balance ->
                        balance.getEmployee() != null &&
                                balance.getEmployee().getId().equals(employeeId)
                )
                .toList();
    }


    // =========================
    // LEAVE APPROVAL
    // =========================

    public LeaveBalance getBalance(
            Long employeeId,
            String leaveType) {

        return leaveBalanceRepository
                .findByEmployeeIdAndLeaveType(
                        employeeId,
                        leaveType
                )
                .orElse(null);
    }


    public void deductLeave(
            Long employeeId,
            String leaveType,
            int days) {

        LeaveBalance balance =
                getBalance(employeeId, leaveType);

        if (balance == null) {

            throw new RuntimeException(
                    "Leave balance not found"
            );
        }

        if (balance.getRemainingLeaves() < days) {

            throw new RuntimeException(
                    "Insufficient leave balance"
            );
        }

        balance.setUsedLeaves(
                balance.getUsedLeaves() + days
        );

        balance.setRemainingLeaves(
                balance.getRemainingLeaves() - days
        );

        leaveBalanceRepository.save(balance);
    }
}