import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import TaskCard from "../components/TaskCard";
import "./TasksPage.css";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token, logout } = useAuth();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(token);
      setTasks(data.content);
    } catch (err) {
      setError("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    try {
      setError("");
      const newTask = await createTask(token, title, description);
      setTasks([newTask, ...tasks]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Error al crear la tarea");
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(token, task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError("Error al actualizar la tarea");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(token, id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError("Error al eliminar la tarea");
    }
  };

  // Contadores para las stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="tasks-wrapper">

      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1>Mis Tareas</h1>
          <span>{pendingTasks} pendientes</span>
        </div>
        <button className="btn-secondary" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      {/* Formulario */}
      <div className="task-form card">
        <h2>Nueva tarea</h2>
        <div className="task-form-fields">
          <input
            className="input"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="task-form-row">
            <input
              className="input"
              placeholder="Título de la tarea *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button className="btn-primary" onClick={handleCreate}>
              + Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {totalTasks > 0 && (
        <div className="tasks-stats">
          <span className="stat-chip active">{totalTasks} total</span>
          <span className="stat-chip">{pendingTasks} pendientes</span>
          <span className="stat-chip">{completedTasks} completadas</span>
        </div>
      )}

      {error && <p className="msg-error" style={{ marginBottom: "16px" }}>{error}</p>}

      {/* Lista */}
      {loading ? (
        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
          Cargando...
        </p>
      ) : tasks.length === 0 ? (
        <div className="tasks-empty">
          <p>📋</p>
          <p>No tenés tareas todavía</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TasksPage;