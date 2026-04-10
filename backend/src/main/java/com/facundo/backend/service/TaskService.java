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
    
    public Task updateTask(Long id, Task updatedTask, String userEmail) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        //Validacion:
        if (!task.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("no autorizado");
        }
        
        //Actualizamos Task:
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setCompleted(updatedTask.getCompleted());

        return taskRepository.save(task);
    }
    public void deleteTask(Long id, String userEmail) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        //Validacion:
        if (!task.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("No autorizado");
        }

        //Borramos Task:
        taskRepository.delete(task);
    }
}