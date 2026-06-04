import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import "../styles/auth.css";
import { api } from "../utils/api";
import { saveAuthSession } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser, currentUser, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await api.post("/api/auth/login", {
        username: credentials.username.trim(),
        password: credentials.password,
      });

      saveAuthSession(data);
      await refreshUser();
      const redirectTo = location.state?.from?.pathname || "/home";
      const redirectHash = location.state?.from?.hash || "";
      navigate(`${redirectTo}${redirectHash}`, { replace: true });
    } catch (error) {
      if (error instanceof TypeError) {
        setErrorMessage("No se pudo conectar con el servidor. Comprueba que el backend esté en marcha (puerto 8080).");
      } else {
        setErrorMessage(error.message || "Error inesperado al iniciar sesión");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoading && currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="main-content d-flex flex-column">
      <nav className="navbar navbar-light bg-transparent py-3">
        <div className="container d-flex justify-content-between">
          <Link to="/" className="text-decoration-none text-muted fw-600 small">
            <i className="bi bi-arrow-left me-1"></i> Volver
          </Link>
          <Link
            to="/"
            className="navbar-brand fw-bold text-primary d-flex align-items-center text-decoration-none"
          >
            <i className="bi bi-bag-check-fill me-2 fs-3"></i> ForBids
          </Link>
          <div style={{ width: "60px" }}></div>
        </div>
      </nav>

      <div className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="login-card shadow-sm p-4 p-md-5 bg-white border-0 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold h3">Iniciar sesión</h2>
                <p className="text-muted small">
                  Bienvenido de nuevo a ForBids
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-600">
                    Usuario o correo
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      name="username"
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="juan_perez o tu@email.com"
                      value={credentials.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-600">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      name="password"
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger small py-2 mb-4" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="small text-muted">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/register"
                    className="text-primary fw-bold text-decoration-none"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
