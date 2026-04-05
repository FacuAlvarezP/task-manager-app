package com.facundo.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facundo.backend.model.User;
import com.facundo.backend.repository.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {
    //El UserController es el encargado de gestionar los endpoints y comunicacion con los mismos.

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
