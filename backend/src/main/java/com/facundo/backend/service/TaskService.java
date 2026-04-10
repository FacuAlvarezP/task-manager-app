package com.facundo.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.facundo.backend.dto.TaskRequestDTO;
import com.facundo.backend.dto.TaskResponseDTO;
import com.facundo.backend.model.Task;
import com.facundo.backend.repository.TaskRepository;

@Service
public class TaskService {
    
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponseDTO createTask(TaskRequestDTO dto, String userEmail) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.getCompleted());
        task.setUserEmail(userEmail);
        Task saved = taskRepository.save(task);

        return new TaskResponseDTO(
            saved.getId(),
            saved.getTitle(),
            saved.getDescription(),
            saved.getCompleted()
        );
    }

    public List<TaskResponseDTO> getUserTasks(String userEmail) {
        return taskRepository.findByUserEmail(userEmail)
        .stream().map(task -> new TaskResponseDTO(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getCompleted()
        )).toList();
    }
    
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO dto, String userEmail) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        //Validacion:
        if (!task.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("no autorizado");
        }
        
        //Actualizamos Task:
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.getCompleted());
        Task updated = taskRepository.save(task);

        return new TaskResponseDTO(
            updated.getId(),
            updated.getTitle(),
            updated.getDescription(),
            updated.getCompleted()
        );
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