import { Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/landing.css";

export default function Landing() {
  const [showHelp, setShowHelp] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: "faq1",
      question: "¿Cómo puedo empezar a vender?",
      answer:
        'Regístrate, entra en el catálogo y pulsa en "Publicar producto". Sube fotos, pon un precio inicial y elige cuánto dura la subasta.',
    },
    {
      id: "faq2",
      question: "¿Cómo funcionan las pujas?",
      answer:
        "Entra en el catálogo y abre un producto. Escribe una puja mayor que el precio actual. Verás el precio actualizarse al instante si alguien puja después que tú.",
    },
    {
      id: "faq3",
      question: "¿Puedo hablar con el vendedor?",
      answer:
        "Cada producto tiene un chat propio. Abre la ficha del artículo y escribe al vendedor o a otros pujadores.",
    },
    {
      id: "faq4",
      question: "¿Cómo funciona el pago?",
      answer:
        "ForBids gestiona la subasta. El pago y la entrega se acuerdan fuera de la plataforma entre comprador y vendedor.",
    },
    {
      id: "faq5",
      question: "¿Puedo usar modo oscuro?",
      answer:
        "Sí. Hay un botón para cambiar entre tema claro y oscuro en la landing y en la barra superior.",
    },
  ];

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
          <div className="ms-auto d-flex align-items-center gap-2">
            <ThemeToggle />
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
          <Link to="/register" className="btn btn-primary-custom text-white text-decoration-none">
            Comenzar ahora
          </Link>
          <Link to="/home" className="btn btn-outline-custom text-decoration-none">
            Explorar productos
          </Link>
        </div>
      </section>

      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="feature-icon bg-social">
              <i className="bi bi-heart"></i>
            </div>
            <h5 className="fw-bold">Favoritos</h5>
            <p className="text-muted px-4">
              Guarda los productos que te interesen y revísalos cuando quieras
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

                <div className="accordion accordion-flush">
                  {faqs.map((faq) => (
                    <div className="accordion-item" key={faq.id}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button fw-600 ${openFaq === faq.id ? "" : "collapsed"}`}
                          type="button"
                          onClick={() =>
                            setOpenFaq((current) => (current === faq.id ? null : faq.id))
                          }
                        >
                          {faq.question}
                        </button>
                      </h2>
                      {openFaq === faq.id && (
                        <div className="accordion-body text-muted">{faq.answer}</div>
                      )}
                    </div>
                  ))}
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
                <a
                  href="mailto:munoz.fernandez.alvaro@iescamas.es"
                  className="btn btn-primary-custom text-white text-decoration-none"
                >
                  Contactar
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
