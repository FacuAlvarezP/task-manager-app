package com.facundo.backend.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facundo.backend.model.Task;
import com.facundo.backend.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, Authentication auth) {
        String email = auth.getPrincipal().toString();
        return taskService.createTask(task, email);
    }

    @GetMapping
    public List<Task> getTasks(Authentication auth) {
        String email = auth.getPrincipal().toString();
        return taskService.getUserTasks(email);
    }
}
