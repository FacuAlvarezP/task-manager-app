import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import TaskCard from "../components/TaskCard";
import "./TasksPage.css";

function TasksPage() {
  // 1. Estados
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Contexto y navegación
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // 3. Funciones helper con useCallback — ANTES del useEffect
  // useCallback memoriza la función para que no se recree en cada render
  // Esto evita que el useEffect se ejecute en loop infinito
  const handleApiError = useCallback((err) => {
    if (err.message === "UNAUTHORIZED") {
      // Token expirado — deslogueamos y React Router redirige al login
      logout();
      navigate("/login");
      return;
    }
    setError(err.message);
  }, [logout, navigate]); 

  // 4. Efectos
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks(token);
        setTasks(data.content);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [token, handleApiError]);

  // 5. Handlers de eventos
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
      handleApiError(err);
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
      handleApiError(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(token, id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      handleApiError(err);
    }
  };

  // Variables derivadas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // 6. JSX
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