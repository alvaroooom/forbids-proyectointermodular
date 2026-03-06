import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function TermsConditions() {
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
          <div className="col-md-8">
            <h1 className="fw-bold mb-4">Términos y Condiciones</h1>
            <p className="text-muted">
              Estos términos y condiciones rigen el uso de ForBids. Al acceder y
              utilizar esta plataforma, aceptas estar vinculado por estos
              términos.
            </p>
            <p className="text-muted mt-4">
              Contenido de términos y condiciones próximamente...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
