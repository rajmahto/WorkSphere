package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.dto.LoginRequest;
import com.worksphere.worksphere.dto.LoginResponse;
import com.worksphere.worksphere.entity.User;
import com.worksphere.worksphere.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(
                request.getEmail(),
                request.getPassword()
        );
    }
}