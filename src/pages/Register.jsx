import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { saveAuthSession } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMessage("Debes aceptar los términos y condiciones");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "No se pudo completar el registro");
      }

      saveAuthSession(data);
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.message || "Error inesperado al registrarse");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="col-md-6 col-lg-4">
            <div className="login-card shadow-sm p-4 p-md-5 bg-white border-0 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold h3">Crear cuenta</h2>
                <p className="text-muted small">Únete a la comunidad ForBids</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-600">
                    Nombre de usuario
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      name="username"
                      type="text"
                      className="form-control"
                      placeholder="juan_perez"
                      value={formData.username}
                      onChange={handleChange}
                      minLength={3}
                      maxLength={50}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-600">
                    Correo electrónico
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="tu@email.com"
                      value={formData.email}
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
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-600">
                    Repetir contraseña
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-check small">
                    <input
                      name="acceptTerms"
                      className="form-check-input"
                      type="checkbox"
                      id="termsCheck"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label text-muted"
                      htmlFor="termsCheck"
                    >
                      Acepto los{" "}
                      <Link
                        to="/terms-conditions"
                        className="text-primary text-decoration-none"
                      >
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-primary text-decoration-none"
                      >
                        política de privacidad
                      </Link>
                    </label>
                  </div>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger small py-2" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="small text-muted">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-primary fw-bold text-decoration-none"
                  >
                    Inicia sesión
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
