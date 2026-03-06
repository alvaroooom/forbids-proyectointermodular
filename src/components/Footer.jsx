import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mb-4">
          <Link
            to="/"
            className="navbar-brand fw-bold text-primary d-flex align-items-center me-2 text-decoration-none"
          >
            <i className="bi bi-bag-check-fill me-2 fs-4"></i> ForBids
          </Link>
          <a href="#" className="text-white text-decoration-none">
            Sobre Nosotros
          </a>
          <a href="#" className="text-white text-decoration-none">
            Contacto
          </a>
          <a href="#" className="text-white text-decoration-none">
            Cookies
          </a>
          <Link
            to="/privacy-policy"
            className="text-white text-decoration-none"
          >
            Política de privacidad
          </Link>
          <Link
            to="/terms-conditions"
            className="text-white text-decoration-none"
          >
            Términos y Condiciones
          </Link>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center small">
          © 2026 ForBids. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
