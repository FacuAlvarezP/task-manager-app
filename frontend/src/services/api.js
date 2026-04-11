const API_URL = "http://localhost:8080";

// Función helper para no repetir el header Authorization en cada llamada
const authHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // El backend espera el token así
});

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.text();
};

// Trae todas las tareas del usuario logueado
export const getTasks = async (token) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) throw new Error("Error al obtener tareas");
    return response.json();
};

// Crea una tarea nueva
export const createTask = async (token, title, description) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ title, description, completed: false }),
    });

    if (!response.ok) throw new Error("Error al crear tarea");
    return response.json();
};

// Cambia el estado completed de una tarea
export const updateTask = async (token, id, taskData) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error("Error al actualizar tarea");
    return response.json();
};

// Elimina una tarea
export const deleteTask = async (token, id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });

    if (!response.ok) throw new Error("Error al eliminar tarea");
};