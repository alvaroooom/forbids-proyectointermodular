import { Link } from "react-router-dom";
import "../styles/auth.css";

const CONTACT_EMAIL = "munoz.fernandez.alvaro@iescamas.es";

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

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 legal-page">
            <h1 className="fw-bold mb-2">Términos y Condiciones</h1>
            <p className="text-muted small mb-4">Última actualización: junio de 2026</p>

            <section className="mb-4">
              <h2 className="h5 fw-bold">1. Aceptación de los términos</h2>
              <p className="text-muted mb-0">
                Al registrarte o utilizar ForBids aceptas estos términos y condiciones. Si no
                estás de acuerdo, no debes usar la plataforma.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">2. Descripción del servicio</h2>
              <p className="text-muted mb-0">
                ForBids permite a los usuarios publicar productos, realizar pujas, comentar,
                guardar favoritos y comunicarse mediante chat asociado a cada subasta. El servicio
                se ofrece con fines educativos dentro del proyecto intermodular DAW.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">3. Registro y cuenta</h2>
              <ul className="text-muted mb-0">
                <li>Debes proporcionar información veraz al crear tu cuenta.</li>
                <li>Eres responsable de mantener la confidencialidad de tus credenciales.</li>
                <li>No está permitido suplantar la identidad de otras personas ni crear cuentas fraudulentas.</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">4. Publicaciones y pujas</h2>
              <ul className="text-muted mb-0">
                <li>Los productos deben describirse con veracidad y respetar la legislación vigente.</li>
                <li>Las pujas realizadas son vinculantes dentro del entorno de la plataforma.</li>
                <li>Cada subasta tiene una fecha límite; al finalizar, gana la puja más alta registrada.</li>
                <li>Queda prohibido manipular pujas, usar bots o conductas que distorsionen las subastas.</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">5. Conducta prohibida</h2>
              <p className="text-muted">
                No se permite publicar contenido ilegal, ofensivo, difamatorio o que infrinja
                derechos de terceros. Tampoco se tolerará el acoso, spam o intentos de acceso no
                autorizado a la plataforma.
              </p>
              <p className="text-muted mb-0">
                El equipo del proyecto podrá suspender cuentas o eliminar contenido que incumpla
                estas normas.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">6. Limitación de responsabilidad</h2>
              <p className="text-muted mb-0">
                ForBids se proporciona &quot;tal cual&quot;, sin garantías comerciales. No nos
                hacemos responsables de disputas entre usuarios, errores técnicos temporales ni
                del uso indebido de la plataforma por parte de terceros.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">7. Modificaciones</h2>
              <p className="text-muted mb-0">
                Podemos actualizar estos términos en cualquier momento. El uso continuado del
                servicio tras un cambio implica la aceptación de la nueva versión.
              </p>
            </section>

            <section>
              <h2 className="h5 fw-bold">8. Contacto</h2>
              <p className="text-muted mb-0">
                Para dudas sobre estos términos escribe a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
