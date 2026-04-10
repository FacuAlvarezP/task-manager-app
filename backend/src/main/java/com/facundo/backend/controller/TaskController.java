package com.facundo.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facundo.backend.dto.TaskRequestDTO;
import com.facundo.backend.dto.TaskResponseDTO;
import com.facundo.backend.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public TaskResponseDTO createTask(@RequestBody TaskRequestDTO dto, Authentication auth) {
        String email = auth.getPrincipal().toString();
        return taskService.createTask(dto, email);
    }

    @GetMapping
    public Page<TaskResponseDTO> getTasks(Pageable pageable, Authentication authentication) {
        String userEmail = authentication.getName();
        return taskService.getUserTasks(userEmail, pageable);
    }

    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO dto, Authentication auth) {
        String email = auth.getPrincipal().toString();
        return taskService.updateTask(id, dto, email);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id, Authentication auth) {
        String email = auth.getPrincipal().toString();
        taskService.deleteTask(id, email);
        return "Tarea eliminada";
    }
}
