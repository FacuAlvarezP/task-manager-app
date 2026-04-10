const API_URL = "http://localhost:8080";

export const login = async (email, password) => {
const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
});

if (!response.ok) {
    throw new Error("Login failed");
}

  return response.text(); // devuelve token
};