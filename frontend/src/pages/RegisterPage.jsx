import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerService } from "../services/api";

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
        <div style={{ maxWidth: "400px", margin: "80px auto", padding: "24px" }}>
            <h2>Crear cuenta</h2>

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px", boxSizing: "border-box" }}
            />

            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px", boxSizing: "border-box" }}
            />

            <input
                placeholder="Contraseña (mínimo 6 caracteres)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", width: "100%", marginBottom: "12px", padding: "8px", boxSizing: "border-box" }}
            />

            {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

            <button
                onClick={handleRegister}
                disabled={loading}
                style={{ width: "100%", padding: "10px", marginBottom: "12px" }}
            >
                {loading ? "Creando cuenta..." : "Registrarse"}
            </button>

            {/* Link para ir al login si ya tenés cuenta */}
            <p style={{ textAlign: "center", color: "#666" }}>
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
        </div>
    );
}

export default RegisterPage;