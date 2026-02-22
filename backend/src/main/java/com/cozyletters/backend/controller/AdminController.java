package com.cozyletters.backend.controller;

import com.cozyletters.backend.dto.AdminLetterResponse;
import com.cozyletters.backend.dto.AdminUserResponse;
import com.cozyletters.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/letters")
    public ResponseEntity<List<AdminLetterResponse>> getAllLetters() {
        return ResponseEntity.ok(adminService.getAllLetters());
    }

    @DeleteMapping("/letters/{id}")
    public ResponseEntity<Void> deleteLetter(@PathVariable Long id) {
        adminService.deleteLetter(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
