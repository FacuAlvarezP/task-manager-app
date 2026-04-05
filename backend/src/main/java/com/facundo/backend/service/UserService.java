package com.facundo.backend.service;

import org.springframework.stereotype.Service;

import com.facundo.backend.model.User;
import com.facundo.backend.repository.UserRepository;

@Service
public class UserService {
    //UserService sirve para gestionar la logica de negocio (validar datos, evitar duplicados, reglas del sistema).
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está en uso");
        }

        return userRepository.save(user);
    }
}
