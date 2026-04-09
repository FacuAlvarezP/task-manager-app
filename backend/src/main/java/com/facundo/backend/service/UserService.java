package com.facundo.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.facundo.backend.exception.InvalidCredentialsException;
import com.facundo.backend.exception.UserAlreadyExistsException;
import com.facundo.backend.exception.UserNotFoundException;
import com.facundo.backend.model.User;
import com.facundo.backend.repository.UserRepository;
import com.facundo.backend.security.JwtUtil;

@Service
public class UserService {
    //UserService sirve para gestionar la logica de negocio (validar datos, evitar duplicados, reglas del sistema).
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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
        //Encriptar password:
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        user.setRole("USER"); //Por defecto

        return userRepository.save(user);
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("Credenciales inválidas"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }
        
        //Generar TOKEN
        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
