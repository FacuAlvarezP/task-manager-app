import "./App.css";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";

function App() {
  // AuthProvider envuelve todo para que cualquier componente
  // pueda acceder al token. AppRouter maneja la navegación.
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
