import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Para mostrar errores al usuario
    const [loading, setLoading] = useState(false); // Para deshabilitar el botón mientras carga

    const { login } = useAuth(); // Función para guardar el token
    const navigate = useNavigate(); // Para redirigir después del login
    
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
    <div>
        <h2>Iniciar sesión</h2>

        <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        {/* Solo mostramos el error si existe */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button 
            onClick={() => {
                console.log("BOTÓN CLICKEADO"); // ← si no ves esto, el problema es el botón
                handleLogin();
            }} 
            disabled={loading}
        >
            {loading ? "Cargando..." : "Entrar"}
        </button>
    </div>
    );
}

export default LoginPage;
