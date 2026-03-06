import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function PrivacyPolicy() {
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
            <h1 className="fw-bold mb-4">Política de Privacidad</h1>
            <p className="text-muted">
              En ForBids, respetamos tu privacidad y nos comprometemos a
              proteger tus datos personales. Esta política de privacidad explica
              cómo recopilamos, utilizamos y compartimos información sobre ti.
            </p>
            <p className="text-muted mt-4">
              Contenido de política de privacidad próximamente...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
