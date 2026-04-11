// TaskCard recibe una tarea y dos funciones como "props"
// Props = datos que el componente padre le pasa al hijo
function TaskCard({ task, onToggle, onDelete }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
            // Si está completada, fondo gris. Si no, blanco
            backgroundColor: task.completed ? "#f0f0f0" : "#fff",
        }}>

            {/* Título con tachado si está completada */}
            <h3 style={{
                margin: "0 0 8px 0",
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#999" : "#000",
            }}>
                {task.title}
            </h3>

            {/* Descripción, solo si existe */}
            {task.description && (
                <p style={{ margin: "0 0 12px 0", color: "#666" }}>
                    {task.description}
                </p>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
                {/* Botón para marcar como completada o pendiente */}
                <button onClick={() => onToggle(task)}>
                    {task.completed ? "↩ Descompletar" : "✓ Completar"}
                </button>

                {/* Botón para eliminar */}
                <button
                    onClick={() => onDelete(task.id)}
                    style={{ color: "red" }}
                >
                    🗑 Eliminar
                </button>
            </div>
        </div>
    );
}

export default TaskCard;