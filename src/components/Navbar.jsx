import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
  currentUser,
  showSearch = false,
  searchQuery = "",
  onSearchChange = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef(null);

  const avatarInitials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : "FB";

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    navigate("/login");
  };

  const closeMenus = () => {
    setShowProfileMenu(false);
    setIsNavOpen(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  useEffect(() => {
    closeMenus();
  }, [location.pathname, location.search]);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowProfileMenu(false);
        setIsNavOpen(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showProfileMenu]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light sticky-top"
      style={{
        backgroundColor: "var(--navbar-bg)",
        borderBottom: "1px solid var(--border-color)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container">
        <Link
          to="/home"
          className="navbar-brand fw-bold text-primary d-flex align-items-center text-decoration-none"
          onClick={closeMenus}
        >
          <i className="bi bi-bag-check-fill me-2 fs-3"></i> ForBids
        </Link>

        <div className="d-flex align-items-center gap-2 ms-auto d-lg-none">
          <ThemeToggle />
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavOpen((prev) => !prev)}
            aria-controls="forbidsNavbar"
            aria-expanded={isNavOpen}
            aria-label="Alternar navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="forbidsNavbar">
          {showSearch && (
            <div className="mx-lg-auto w-100 mt-3 mt-lg-0" style={{ maxWidth: "620px" }}>
              <div className="input-group buscador-nav">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    color: "var(--text-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar productos, marcas..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  style={{
                    backgroundColor: "var(--input-bg)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                />
              </div>
            </div>
          )}

          <div className="navbar-actions ms-lg-auto d-flex align-items-center gap-3 mt-3 mt-lg-0 flex-wrap justify-content-lg-end">
            <ThemeToggle className="d-none d-lg-inline-flex" />

            {currentUser ? (
              <>
                <Link to="/products/new" className="btn btn-sm btn-primary" onClick={closeMenus}>
                  Publicar
                </Link>

                <Link
                  to="/profile?tab=favorites"
                  className="fs-5 text-decoration-none"
                  style={{ color: "var(--text-primary)" }}
                  title="Favoritos"
                  onClick={closeMenus}
                >
                  <i className="bi bi-heart"></i>
                </Link>

                <Link
                  to="/my-bids"
                  className="fs-5 text-decoration-none"
                  style={{ color: "var(--text-primary)" }}
                  title="Mis pujas"
                  onClick={closeMenus}
                >
                  <i className="bi bi-hammer"></i>
                </Link>

                <div className="profile-dropdown position-relative" ref={dropdownRef}>
                  <button
                    className="btn p-0 border-0 bg-transparent"
                    onClick={toggleProfileMenu}
                    type="button"
                    aria-expanded={showProfileMenu}
                    aria-haspopup="true"
                    aria-label="Abrir menú de perfil"
                  >
                    {currentUser.profileImageUrl ? (
                      <img
                        src={currentUser.profileImageUrl}
                        alt={currentUser.username}
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="avatar-nav"
                      style={{ display: currentUser.profileImageUrl ? "none" : "flex" }}
                    >
                      {avatarInitials}
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div
                      className="dropdown-menu dropdown-menu-end show position-absolute mt-2 shadow-lg"
                      style={{
                        right: 0,
                        minWidth: "250px",
                        backgroundColor: "var(--card-bg)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div className="px-3 py-2 border-bottom">
                        <div className="fw-bold">{currentUser.username}</div>
                        <div className="small text-muted">{currentUser.email}</div>
                      </div>

                      <Link
                        to="/profile?tab=products"
                        className="dropdown-item py-2"
                        onClick={closeMenus}
                      >
                        <i className="bi bi-bag me-2"></i>
                        Mis productos
                      </Link>

                      <Link
                        to="/my-bids"
                        className="dropdown-item py-2"
                        onClick={closeMenus}
                      >
                        <i className="bi bi-hammer me-2"></i>
                        Mis Pujas
                      </Link>

                      <div className="dropdown-divider"></div>

                      <div className="dropdown-header small text-uppercase fw-bold">
                        Ver más
                      </div>

                      {currentUser.role === "ADMIN" && (
                        <>
                          <Link
                            to="/admin"
                            className="dropdown-item py-2"
                            onClick={closeMenus}
                          >
                            <i className="bi bi-shield-lock me-2"></i>
                            Panel de administración
                          </Link>
                          <div className="dropdown-divider"></div>
                        </>
                      )}

                      <Link
                        to="/profile?tab=edit"
                        className="dropdown-item py-2"
                        onClick={closeMenus}
                      >
                        <i className="bi bi-person-gear me-2"></i>
                        Editar perfil
                      </Link>

                      <Link
                        to="/profile?tab=settings"
                        className="dropdown-item py-2"
                        onClick={closeMenus}
                      >
                        <i className="bi bi-gear me-2"></i>
                        Configuración
                      </Link>

                      <Link
                        to="/profile?tab=favorites"
                        className="dropdown-item py-2"
                        onClick={closeMenus}
                      >
                        <i className="bi bi-heart me-2"></i>
                        Favoritos
                      </Link>

                      <div className="dropdown-divider"></div>

                      <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-primary" onClick={closeMenus}>
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary" onClick={closeMenus}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
