import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/landing.css";

export default function Landing() {
  const [showHelp, setShowHelp] = useState(false);

  const handleHelpShow = () => setShowHelp(true);
  const handleHelpHide = () => setShowHelp(false);

  return (
    <div className="main-content">
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent py-3">
        <div className="container">
          <Link
            to="/"
            className="navbar-brand fw-bold text-primary d-flex align-items-center text-decoration-none"
          >
            <i className="bi bi-bag-check-fill me-2 fs-3"></i> ForBids
          </Link>
          <div className="ms-auto">
            <Link
              to="/login"
              className="btn text-primary fw-600 me-2 text-decoration-none"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="btn btn-primary-custom text-white px-4 text-decoration-none"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero-section text-center container">
        <h1 className="hero-title">Compra, vende y conecta con tu comunidad</h1>
        <p className="hero-subtitle fs-5 mt-4">
          La plataforma de subasta y compraventa de segunda mano más social y
          cercana. Descubre productos únicos cerca de ti.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-primary-custom text-white">
            Comenzar ahora
          </button>
          <button className="btn btn-outline-custom">Explorar productos</button>
        </div>
      </section>

      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="feature-icon bg-social">
              <i className="bi bi-heart"></i>
            </div>
            <h5 className="fw-bold">Social</h5>
            <p className="text-muted px-4">
              Dale like a tus productos favoritos y sigue a vendedores de
              confianza
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-icon bg-community">
              <i className="bi bi-people"></i>
            </div>
            <h5 className="fw-bold">Comunidad</h5>
            <p className="text-muted px-4">
              Conecta con compradores y vendedores de tu zona
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-icon bg-fast">
              <i className="bi bi-graph-up-arrow"></i>
            </div>
            <h5 className="fw-bold">Fácil y rápido</h5>
            <p className="text-muted px-4">
              Publica tus productos en segundos y vende más rápido
            </p>
          </div>
        </div>
      </section>

      <button className="btn-help-float" onClick={handleHelpShow}>
        <i className="bi bi-question-circle"></i>
      </button>

      {showHelp && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Centro de Ayuda</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleHelpHide}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">
                  Encuentra respuestas rápidas a las dudas más comunes sobre
                  ForBids.
                </p>

                <div className="accordion accordion-flush" id="accordionFAQ">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq1"
                      >
                        ¿Cómo puedo empezar a vender?
                      </button>
                    </h2>
                    <div
                      id="faq1"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFAQ"
                    >
                      <div className="accordion-body text-muted">
                        ¡Es muy fácil! Solo tienes que registrarte, ir a tu
                        perfil y pulsar en el botón "Publicar producto". Sube
                        unas fotos, pon un precio o activa el modo subasta y
                        ¡listo!
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq2"
                      >
                        ¿Es seguro el sistema de pujas?
                      </button>
                    </h2>
                    <div
                      id="faq2"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFAQ"
                    >
                      <div className="accordion-body text-muted">
                        Sí, ForBids garantiza que todas las pujas sean
                        vinculantes. Verificamos la identidad de los usuarios
                        para evitar pujas falsas y asegurar una comunidad
                        transparente.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq3"
                      >
                        ¿Cómo contacto con un vendedor?
                      </button>
                    </h2>
                    <div
                      id="faq3"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFAQ"
                    >
                      <div className="accordion-body text-muted">
                        Puedes usar nuestro chat interno haciendo clic en el
                        icono de mensaje dentro de cualquier publicación de
                        producto. Así mantendrás tu privacidad a salvo.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq4"
                      >
                        ¿Cuáles son los métodos de pago aceptados?
                      </button>
                    </h2>
                    <div
                      id="faq4"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFAQ"
                    >
                      <div className="accordion-body text-muted">
                        Aceptamos tarjetas de crédito/débito, PayPal y pagos
                        seguros a través de nuestra pasarela integrada.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq5"
                      >
                        ¿Qué hago si un producto no llega?
                      </button>
                    </h2>
                    <div
                      id="faq5"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionFAQ"
                    >
                      <div className="accordion-body text-muted">
                        Contamos con un sistema de protección al comprador. Si
                        el producto no llega, puedes abrir una disputa desde tu
                        panel de usuario.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-light fw-600"
                  onClick={handleHelpHide}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary-custom text-white"
                >
                  Contactar soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
