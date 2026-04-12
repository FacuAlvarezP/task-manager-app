const API_URL = "http://localhost:8080";

// Función central para todos los requests autenticados
// En vez de repetir lógica en cada función, la centralizamos acá
const fetchWithAuth = async (url, options, token) => {
    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    // Si el token expiró, lanzamos un error especial
    // El componente que llame a esta función puede reaccionar a esto
    if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
    }

    return response;
};

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.text();
};

export const register = async (username, email, password) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrarse");
    }

    return response.json();
};

export const getTasks = async (token) => {
    const response = await fetchWithAuth("/tasks", { method: "GET" }, token);
    if (!response.ok) throw new Error("Error al obtener tareas");
    return response.json();
};

export const createTask = async (token, title, description) => {
    const response = await fetchWithAuth(
        "/tasks",
        {
        method: "POST",
        body: JSON.stringify({ title, description, completed: false }),
        },
        token
    );
    if (!response.ok) throw new Error("Error al crear tarea");
    return response.json();
};

export const updateTask = async (token, id, taskData) => {
    const response = await fetchWithAuth(
        `/tasks/${id}`,
        {
        method: "PUT",
        body: JSON.stringify(taskData),
        },
        token
    );
    if (!response.ok) throw new Error("Error al actualizar tarea");
    return response.json();
};

export const deleteTask = async (token, id) => {
    const response = await fetchWithAuth(
        `/tasks/${id}`,
        { method: "DELETE" },
        token
    );
    if (!response.ok) throw new Error("Error al eliminar tarea");
};