package com.facundo.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facundo.backend.dto.UserProfileDTO;
import com.facundo.backend.dto.UserRequestDTO;
import com.facundo.backend.dto.UserResponseDTO;
import com.facundo.backend.model.User;
import com.facundo.backend.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
    //UserController es el encargado de gestionar los endpoints y comunicacion con los mismos.

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponseDTO createUser(@RequestBody UserRequestDTO dto) {
        return userService.createUser(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody UserRequestDTO dto) {
        return userService.login(dto);
    }

    @GetMapping("/profile")
    public UserProfileDTO profile(Authentication authentication) {
        String email = authentication.getPrincipal().toString();
        User user = userService.getUserByEmail(email);
        //Devolvemos DTO
        return new UserProfileDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }
}
