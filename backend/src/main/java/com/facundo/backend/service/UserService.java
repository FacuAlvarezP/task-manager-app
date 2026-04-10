package com.facundo.backend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.facundo.backend.dto.UserRequestDTO;
import com.facundo.backend.dto.UserResponseDTO;
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

    public UserResponseDTO createUser(UserRequestDTO dto) {
        
        //Valida que no se duplique el email
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new UserAlreadyExistsException("El email ya existe");
        }
        //Valida que no se duplique el username
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new UserAlreadyExistsException("El username ya existe");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        //Encriptar password:
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER"); //Por defecto
        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole()
        );
    }

    public String login(UserRequestDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new UserNotFoundException("Credenciales inválidas"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }
        
        //Generar TOKEN
        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
