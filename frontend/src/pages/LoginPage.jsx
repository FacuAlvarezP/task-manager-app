import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/api";
import "./AuthPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Para mostrar errores al usuario
    const [loading, setLoading] = useState(false); // Para deshabilitar el botón mientras carga

    const { login } = useAuth(); // Función para guardar el token
    const navigate = useNavigate(); // Para redirigir después del login
    const location = useLocation(); //nos da acceso al state que mandamos desde RegisterPage

    // Si venimos del registro, location.state tiene el mensaje de éxito
    const successMessage = location.state?.message;
    
    const handleLogin = async () => {
        setError(""); // Limpiamos errores anteriores
        setLoading(true); // Activamos el estado de carga

        try {
            const token = await loginService(email, password);
            login(token); //Guardamos el token en el contexto y localStorage
            navigate("/tasks"); //Redirigimos a la pantalla de tareas
        } catch (err) {
            setError("Email o contraseña incorrectos");
        } finally {
            setLoading(false); //Siempre desactivamos el loading, haya error o no
        }
    };

    // Permite hacer login presionando Enter
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card card">

                <div className="auth-header">
                    <div className="auth-icon">✓</div>
                    <h1>Bienvenido</h1>
                    <p>Iniciá sesión para ver tus tareas</p>
                </div>

                <div className="auth-form">
                    {successMessage && (
                        <p className="msg-success">{successMessage}</p>
                    )}

                    <input
                        className="input"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <input
                        className="input"
                        placeholder="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    {error && <p className="msg-error">{error}</p>}

                    <button
                        className="btn-primary"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </div>

                <div className="auth-footer">
                    ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
