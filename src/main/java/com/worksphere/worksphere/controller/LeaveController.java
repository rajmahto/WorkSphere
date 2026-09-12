package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.entity.Leave;
import com.worksphere.worksphere.service.LeaveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public Leave applyLeave(@RequestBody Leave leave) {
        return leaveService.applyLeave(leave);
    }

    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @GetMapping("/{id}")
    public Leave getLeaveById(@PathVariable Long id) {
        return leaveService.getLeaveById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteLeave(@PathVariable Long id) {
        leaveService.deleteLeave(id);
        return "Leave deleted successfully";
    }
    @PutMapping("/{id}/approve")
    public Leave approveLeave(@PathVariable Long id) {
        return leaveService.approveLeave(id);
    }

    @PutMapping("/{id}/reject")
    public Leave rejectLeave(@PathVariable Long id) {
        return leaveService.rejectLeave(id);
    }
}