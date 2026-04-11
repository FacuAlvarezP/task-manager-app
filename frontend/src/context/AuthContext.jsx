import { createContext, useState, useContext } from "react";

// 1. Creamos el "contenedor" del contexto
const AuthContext = createContext();

// 2. Este componente va a ENVOLVER toda la app y compartir el estado
export function AuthProvider({ children }) {
    // El token empieza con lo que haya en localStorage (por si el usuario ya estaba logueado)
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Función para guardar el token cuando el usuario hace login
    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    // Función para borrar el token cuando el usuario hace logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    // Esto es lo que va a estar disponible en toda la app
    const value = {
        token,
        login,
        logout,
        isAuthenticated: !!token, // true si hay token, false si no
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Hook personalizado para usar el contexto fácilmente
// En vez de escribir useContext(AuthContext) en cada componente,
// solo escribimos useAuth()
export function useAuth() {
    return useContext(AuthContext);
}
