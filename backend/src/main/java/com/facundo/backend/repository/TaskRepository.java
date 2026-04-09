package com.facundo.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.facundo.backend.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserEmail(String userEmail);
    
}
