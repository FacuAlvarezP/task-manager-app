import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/api";

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

    return (
        <div style={{ maxWidth: "400px", margin: "80px auto", padding: "24px" }}>
            <h2>Iniciar sesión</h2>

            {/* Mensaje de éxito del registro, en verde */}
            {successMessage && (
                <p style={{ color: "green", marginBottom: "12px" }}>{successMessage}</p>
            )}

            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px", boxSizing: "border-box" }}
            />

            <input
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: "12px", padding: "8px", boxSizing: "border-box" }}
            />

            {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

            <button
                onClick={handleLogin}
                disabled={loading}
                style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
            >
                {loading ? "Cargando..." : "Entrar"}
            </button>

            {/* Link para ir al registro si no tenés cuenta */}
            <p style={{ textAlign: "center", color: "#666" }}>
                ¿No tenés cuenta? <Link to="/register">Registrate</Link>
            </p>
        </div>
    );
}

export default LoginPage;
