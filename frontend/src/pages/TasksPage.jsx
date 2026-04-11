import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import TaskCard from "../components/TaskCard";

function TasksPage() {
  // Lista de tareas que vienen del backend
  const [tasks, setTasks] = useState([]);

  // Campos del formulario para crear tarea
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Estados de UI
  const [loading, setLoading] = useState(true);   // cargando la lista inicial
  const [error, setError] = useState("");

  // Traemos el token y la función logout del contexto
  const { token, logout } = useAuth();

  // useEffect se ejecuta cuando el componente se monta (aparece en pantalla)
  // Es el lugar correcto para hacer llamadas a la API al cargar la página
  useEffect(() => {
    loadTasks();
  }, []); // El [] significa "ejecutar solo una vez, al montar el componente"

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(token);
      // El backend devuelve un objeto paginado, las tareas están en data.content
      setTasks(data.content);
    } catch (err) {
      setError("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    // Validación básica
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    try {
      setError("");
      const newTask = await createTask(token, title, description);
      // Agregamos la tarea nueva al estado local sin recargar todo
      // Esto hace la UI más rápida
      setTasks([newTask, ...tasks]);
      // Limpiamos el formulario
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Error al crear la tarea");
    }
  };

  const handleToggle = async (task) => {
    try {
      // Enviamos la tarea con el completed invertido
      const updated = await updateTask(token, task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });

      // Actualizamos solo esa tarea en el estado local
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError("Error al actualizar la tarea");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(token, id);
      // Filtramos la tarea eliminada del estado local
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError("Error al eliminar la tarea");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Mis Tareas</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </div>

      {/* Formulario nueva tarea */}
      <div style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
      }}>
        <h3 style={{ margin: "0 0 12px 0" }}>Nueva tarea</h3>

        <input
          placeholder="Título *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px", boxSizing: "border-box" }}
        />

        <input
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "12px", padding: "8px", boxSizing: "border-box" }}
        />

        <button onClick={handleCreate}>+ Agregar tarea</button>
      </div>

      {/* Mensaje de error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista de tareas */}
      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center" }}>
          No tenés tareas todavía. ¡Creá una!
        </p>
      ) : (
        tasks.map((task) => (
          // key es obligatorio cuando renderizás listas en React
          // Le dice a React qué elemento es cuál para actualizarlos eficientemente
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

export default TasksPage;