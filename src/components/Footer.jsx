import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GITHUB_PROFILE = "https://github.com/alvaroooom";
const CONTACT_EMAIL = "munoz.fernandez.alvaro@iescamas.es";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { currentUser } = useAuth();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4 g-lg-5 py-5">
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="footer-brand text-decoration-none">
              <i className="bi bi-bag-check-fill me-2"></i>
              ForBids
            </Link>
            <p className="footer-tagline mt-3 mb-4">
              Plataforma de compraventa y subastas creada como proyecto
              intermodular en 2º DAW. Pujas en vivo, chat y gestión de productos.
            </p>
            <div className="d-flex gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="footer-social"
                title="Email"
                aria-label="Email"
              >
                <i className="bi bi-envelope-fill"></i>
              </a>
              <a
                href={GITHUB_PROFILE}
                className="footer-social"
                title="GitHub"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h3 className="footer-heading">Explorar</h3>
            <ul className="footer-links list-unstyled">
              {currentUser ? (
                <>
                  <li>
                    <Link to="/home">Catálogo</Link>
                  </li>
                  <li>
                    <Link to="/products/new">Publicar producto</Link>
                  </li>
                  <li>
                    <Link to="/my-bids">Mis pujas</Link>
                  </li>
                  <li>
                    <Link to="/profile">Mi perfil</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" state={{ from: { pathname: "/home" } }}>
                      Catálogo
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" state={{ from: { pathname: "/products/new" } }}>
                      Publicar producto
                    </Link>
                  </li>
                  <li>
                    <Link to="/register">Crear cuenta</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {currentUser && (
            <div className="col-6 col-md-3 col-lg-2">
              <h3 className="footer-heading">Cuenta</h3>
              <ul className="footer-links list-unstyled">
                <li>
                  <Link to="/profile?tab=settings">Configuración</Link>
                </li>
              </ul>
            </div>
          )}

          <div className="col-md-6 col-lg-4">
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-links list-unstyled">
              <li>
                <Link to="/privacy-policy">Política de privacidad</Link>
              </li>
              <li>
                <Link to="/terms-conditions">Términos y condiciones</Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>Contacto</a>
              </li>
            </ul>
            <p className="footer-note mt-3 mb-0">
              <i className="bi bi-mortarboard me-2"></i>
              Proyecto intermodular — IES Camas, 2º DAW.
            </p>
          </div>
        </div>

        <div className="footer-bottom py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span className="small">
              © {currentYear} Álvaro Muñoz · ForBids
            </span>
            <a
              href={GITHUB_PROFILE}
              className="small text-muted text-decoration-none"
              target="_blank"
              rel="noreferrer"
            >
              github.com/alvaroooom
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
