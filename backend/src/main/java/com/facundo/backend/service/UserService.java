package com.facundo.backend.service;

import org.springframework.stereotype.Service;

import com.facundo.backend.exception.InvalidCredentialsException;
import com.facundo.backend.exception.UserAlreadyExistsException;
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
        
        //Valida que no se duplique el email
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("El email ya está en uso");
        }
        //Valida que no se duplique el username
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("El username ya está en uso");
        }

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));

        if (!user.getPassword().equals(password)) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        return user;
    }
}
