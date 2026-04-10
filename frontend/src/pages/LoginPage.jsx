import { useState } from "react";
import { login } from "../services/api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
    try {
        const token = await login(email, password);
        console.log("TOKEN:", token);

        localStorage.setItem("token", token);
        alert("Login exitoso 🚀");
        } catch (error) {
            alert("Error en login");
        }
    };

    return (
        <div>
        <h2>Login</h2>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;
