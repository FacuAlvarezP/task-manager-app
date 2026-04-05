package com.facundo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.facundo.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    //UserRepository es el encargado de comunicarse con la base de datos.
    
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<User> findByEmail(String email);
}
