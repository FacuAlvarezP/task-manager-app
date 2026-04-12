import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerService } from "../services/api";
import "./AuthPage.css";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        // Validaciones básicas en el frontend
        // Esto evita llamadas innecesarias al backend
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await registerService(username, email, password);

            // Redirigimos al login con un state para mostrar mensaje de éxito
            // El state es una forma de pasar datos entre páginas sin usar la URL
            navigate("/login", { state: { message: "¡Cuenta creada! Ya podés iniciar sesión." } });

        } catch (err) {
            // Mostramos el mensaje que viene del backend
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card card">

                <div className="auth-header">
                    <div className="auth-icon">+</div>
                    <h1>Crear cuenta</h1>
                    <p>Empezá a organizar tus tareas hoy</p>
                </div>

                <div className="auth-form">
                    <input
                        className="input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="input"
                        placeholder="Contraseña (mínimo 6 caracteres)"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="msg-error">{error}</p>}

                    <button
                        className="btn-primary"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </div>

                <div className="auth-footer">
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;