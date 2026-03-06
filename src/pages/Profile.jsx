import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Profile() {
  return (
    <div className="main-content">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 sticky-top">
        <div className="container">
          <Link
            to="/home"
            className="navbar-brand fw-bold text-primary d-flex align-items-center text-decoration-none"
          >
            <i className="bi bi-bag-check-fill me-2 fs-3"></i> ForBids
          </Link>

          <div className="ms-auto d-flex align-items-center gap-3">
            <a href="#" className="text-dark fs-5">
              <i className="bi bi-heart"></i>
            </a>
            <a href="#" className="text-dark fs-5 position-relative">
              <i className="bi bi-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </a>
            <a href="#" className="text-dark fs-5 position-relative">
              <i className="bi bi-chat-dots"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </a>
            <Link
              to="/profile"
              className="d-flex align-items-center text-decoration-none gap-2"
            >
              <div className="avatar-nav">JS</div>
            </Link>
            <Link to="/" className="text-dark fs-5">
              <i className="bi bi-box-arrow-right"></i>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <p className="text-muted text-center">
          Página de perfil próximamente...
        </p>
      </div>
    </div>
  );
}
