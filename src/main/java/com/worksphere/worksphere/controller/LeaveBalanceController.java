package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.entity.LeaveBalance;
import com.worksphere.worksphere.service.LeaveBalanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-balances")
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    public LeaveBalanceController(LeaveBalanceService leaveBalanceService) {
        this.leaveBalanceService = leaveBalanceService;
    }

    @PostMapping
    public LeaveBalance createLeaveBalance(@RequestBody LeaveBalance leaveBalance) {
        return leaveBalanceService.createLeaveBalance(leaveBalance);
    }

    @GetMapping
    public List<LeaveBalance> getAllLeaveBalances() {
        return leaveBalanceService.getAllLeaveBalances();
    }

    @GetMapping("/{id}")
    public LeaveBalance getLeaveBalanceById(@PathVariable Long id) {
        return leaveBalanceService.getLeaveBalanceById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteLeaveBalance(@PathVariable Long id) {
        leaveBalanceService.deleteLeaveBalance(id);
    }
}