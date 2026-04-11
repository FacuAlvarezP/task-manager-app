import { useAuth } from "../context/AuthContext";

function TasksPage() {
    const { logout } = useAuth();

    return (
        <div>
        <h2>Mis Tareas</h2>
        <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
}

export default TasksPage;