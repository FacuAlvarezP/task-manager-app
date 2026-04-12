import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import TasksPage from "../pages/TasksPage";

// Este componente protege rutas: si no estás logueado, te manda al login
function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    
    // Si no hay token, redirigí al login
    if (!isAuthenticated) return <Navigate to="/login" />;
    // Si hay token, mostrá la página pedida
    return children;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Ruta protegida: solo accesible con token */}
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                        <TasksPage />
                        </PrivateRoute>
                    }
                />
                {/* Si entrás a "/" te manda a /tasks */}
                <Route path="/" element={<Navigate to="/tasks" />} />
            </Routes>
        </BrowserRouter>
    );
}