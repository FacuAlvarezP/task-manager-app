package com.facundo.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facundo.backend.model.Task;
import com.facundo.backend.repository.TaskRepository;

@Service
public class TaskService {
    
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    public Task createTask(Task task, String userEmail) {
        task.setUserEmail(userEmail);
        return taskRepository.save(task);
    }

    public List<Task> getUserTasks(String userEmail) {
        return taskRepository.findByUserEmail(userEmail);
    }
}
