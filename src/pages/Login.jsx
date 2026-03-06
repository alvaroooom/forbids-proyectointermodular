import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
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

              <form>
                <div className="mb-3">
                  <label className="form-label small fw-600">
                    Correo electrónico
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="tu@email.com"
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
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 small">
                  <a
                    href="#"
                    className="text-decoration-none text-primary fw-600"
                  >
                    ¿Has olvidado tu contraseña?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 mb-3"
                >
                  Iniciar sesión
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
