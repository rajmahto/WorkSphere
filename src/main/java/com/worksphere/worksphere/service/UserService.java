package com.worksphere.worksphere.service;

import com.worksphere.worksphere.dto.LoginResponse;
import com.worksphere.worksphere.entity.User;
import com.worksphere.worksphere.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User saveUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            throw new RuntimeException("Role is required");
        }

        String role = user.getRole().toUpperCase();

        if (!role.equals("ADMIN")
                && !role.equals("HR")
                && !role.equals("EMPLOYEE")) {

            throw new RuntimeException(
                    "Invalid role. Use ADMIN, HR or EMPLOYEE"
            );
        }

        user.setRole(role);

        String encodedPassword =
                passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    public LoginResponse login(String email, String password) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getRole()
        );
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("New password is required");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    public User updateUser(Long id, User user) {

        User existingUser =
                userRepository.findById(id).orElse(null);

        if (existingUser == null) {
            throw new RuntimeException("User not found");
        }

        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            existingUser.setEmail(user.getEmail());
        }

        if (user.getRole() != null && !user.getRole().isBlank()) {

            String role = user.getRole().toUpperCase();

            if (!role.equals("ADMIN")
                    && !role.equals("HR")
                    && !role.equals("EMPLOYEE")) {

                throw new RuntimeException(
                        "Invalid role. Use ADMIN, HR or EMPLOYEE"
                );
            }

            existingUser.setRole(role);
        }

        if (user.getPassword() != null
                && !user.getPassword().isBlank()) {

            String encodedPassword =
                    passwordEncoder.encode(user.getPassword());

            existingUser.setPassword(encodedPassword);
        }

        return userRepository.save(existingUser);
    }
}