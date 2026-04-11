const API_URL = "http://localhost:8080";

export const login = async (email, password) => {
    console.log("Intentando login con:", email); // Log para verificar que llegan los datos

    const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    });

    console.log("Status de respuesta:", response.status); // ¿Qué código devuelve?

    if (!response.ok) {
        // Leemos el cuerpo del error para ver qué dice el backend exactamente
        const errorBody = await response.text();
        console.log("Error del backend:", errorBody);
        throw new Error("Login failed");
    }

    return response.text();
};