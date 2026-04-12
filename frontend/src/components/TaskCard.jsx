// TaskCard recibe una tarea y dos funciones como "props"
// Props = datos que el componente padre le pasa al hijo
import "./TaskCard.css";

function TaskCard({ task, onToggle, onDelete }) {
    return (
        <div className={`task-card card ${task.completed ? "completed" : ""}`}>

            {/* Checkbox para completar/descompletar */}
            <button
                className="task-checkbox"
                onClick={() => onToggle(task)}
                title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            >
                {task.completed && "✓"}
            </button>

            {/* Título y descripción */}
            <div className="task-content">
                <p className="task-title">{task.title}</p>
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
            </div>

            {/* Botón eliminar */}
            <button
                className="btn-danger task-delete"
                onClick={() => onDelete(task.id)}
                title="Eliminar tarea"
            >
                ✕
            </button>
        </div>
    );
}

export default TaskCard;