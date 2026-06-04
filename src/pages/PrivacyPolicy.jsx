import { Link } from "react-router-dom";
import "../styles/auth.css";

const CONTACT_EMAIL = "munoz.fernandez.alvaro@iescamas.es";

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

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 legal-page">
            <h1 className="fw-bold mb-2">Política de Privacidad</h1>
            <p className="text-muted small mb-4">Última actualización: junio de 2026</p>

            <section className="mb-4">
              <h2 className="h5 fw-bold">1. Responsable del tratamiento</h2>
              <p className="text-muted mb-0">
                ForBids es un proyecto académico de compraventa y subastas. Para cualquier
                consulta sobre privacidad puedes escribir a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">2. Datos que recopilamos</h2>
              <p className="text-muted">
                Al registrarte y usar la plataforma podemos tratar:
              </p>
              <ul className="text-muted">
                <li>Datos de cuenta: nombre de usuario, email y contraseña cifrada.</li>
                <li>Datos de perfil: imagen de perfil y preferencias de la aplicación.</li>
                <li>Actividad en la plataforma: productos publicados, pujas, comentarios, favoritos y mensajes de chat.</li>
                <li>Datos técnicos básicos: token de sesión y registros necesarios para el funcionamiento del servicio.</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">3. Finalidad del tratamiento</h2>
              <p className="text-muted mb-0">
                Utilizamos tus datos para gestionar tu cuenta, permitir la publicación de productos,
                procesar pujas, mostrar el historial de actividad y mantener la seguridad de la plataforma.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">4. Conservación y seguridad</h2>
              <p className="text-muted mb-0">
                Los datos se conservan mientras mantengas una cuenta activa o mientras sean
                necesarios para el funcionamiento del proyecto. Aplicamos medidas razonables de
                seguridad, como autenticación mediante JWT y almacenamiento de contraseñas cifradas.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">5. Cesión de datos</h2>
              <p className="text-muted mb-0">
                No vendemos tus datos personales. Solo se compartirán con terceros cuando la
                ley lo exija.
              </p>
            </section>

            <section className="mb-4">
              <h2 className="h5 fw-bold">6. Tus derechos</h2>
              <p className="text-muted mb-0">
                Puedes acceder, rectificar o solicitar la eliminación de tus datos contactando
                con el responsable del proyecto. También puedes modificar parte de tu información
                desde la sección de perfil de ForBids.
              </p>
            </section>

            <section>
              <h2 className="h5 fw-bold">7. Cambios en esta política</h2>
              <p className="text-muted mb-0">
                Podemos actualizar esta política para adaptarla a cambios legales o mejoras del
                servicio. La versión vigente estará siempre disponible en esta página.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
