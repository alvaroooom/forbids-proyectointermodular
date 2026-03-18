import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LiveCountdown from "../components/LiveCountdown";
import { clearAuthSession, fetchCurrentUser, getAuthSession } from "../utils/auth";
import { formatAuctionEndDate, isAuctionClosed, isAuctionUrgent } from "../utils/auctionTime";
import { getCategoryLabel, getCategoryBadgeClass } from "../utils/categories";

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      try {
        const user = await fetchCurrentUser();
        
        // Verificar que el usuario sea administrador
        if (user.role !== "ADMIN") {
          if (isMounted) {
            navigate("/home");
          }
          return;
        }

        if (isMounted) {
          setCurrentUser(user);
        }
      } catch {
        clearAuthSession();
        if (isMounted) {
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (isCheckingSession || !currentUser) {
      return;
    }

    let isMounted = true;

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const session = getAuthSession();
        if (!session?.token) {
          throw new Error("No active session");
        }

        const response = await fetch("http://localhost:8080/api/products/admin/all", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        if (isMounted && error.message.includes("session")) {
          clearAuthSession();
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [isCheckingSession, currentUser, navigate]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !product.closed) ||
      (statusFilter === "closed" && product.closed);

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (isCheckingSession) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        currentUser={currentUser}
        showSearch={false}
        onLogout={handleLogout}
      />
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-6 fw-bold text-primary">
              <i className="bi bi-shield-lock me-2"></i>
              Panel de Administración
            </h1>
            <p className="text-muted">
              Historial completo de todas las subastas (activas y cerradas)
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Buscar</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por título o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Estado</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="active">Activas</option>
                  <option value="closed">Cerradas</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Categoría</label>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="ELECTRONICS">Electrónica</option>
                  <option value="FASHION">Moda</option>
                  <option value="HOME">Hogar</option>
                  <option value="SPORTS">Deportes</option>
                  <option value="AUTOMOTIVE">Automoción</option>
                  <option value="BOOKS">Libros</option>
                  <option value="ART">Arte</option>
                  <option value="MUSIC">Música</option>
                  <option value="TOYS">Juguetes</option>
                  <option value="OTHER">Otros</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-primary">{products.length}</h3>
                <p className="text-muted mb-0">Total de subastas</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-success">
                  {products.filter((p) => !p.closed).length}
                </h3>
                <p className="text-muted mb-0">Subastas activas</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h3 className="text-secondary">
                  {products.filter((p) => p.closed).length}
                </h3>
                <p className="text-muted mb-0">Subastas cerradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        {isLoadingProducts ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando productos...</span>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="text-muted mt-3">No se encontraron productos</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => {
              const closed = isAuctionClosed(product.endAt, product.closed);
              const urgent = isAuctionUrgent(product.endAt, product.closed);

              return (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm product-card">
                    <div className="position-relative">
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/400x300"}
                        className="card-img-top"
                        alt={product.title}
                        style={{ height: "200px", objectFit: "cover" }}
                        loading="lazy"
                      />
                      {product.category && (
                        <span
                          className={`badge position-absolute top-0 start-0 m-2 ${getCategoryBadgeClass(
                            product.category
                          )}`}
                        >
                          {getCategoryLabel(product.category)}
                        </span>
                      )}
                      {closed && (
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-dark">
                            <i className="bi bi-lock-fill me-1"></i>
                            Cerrada
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-truncate">{product.title}</h5>
                      <p className="card-text text-muted small text-truncate-2">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small">Puja actual</span>
                          <span className="fw-bold text-primary fs-5">
                            {product.currentPrice?.toFixed(2) || product.startingPrice?.toFixed(2) || '0.00'}€
                          </span>
                        </div>

                        <div className="d-flex justify-content-between text-muted small mb-2">
                          <span>
                            <i className="bi bi-hammer me-1"></i>
                            {product.bidsCount} puja{product.bidsCount !== 1 ? "s" : ""}
                          </span>
                          <span>
                            <i className="bi bi-person me-1"></i>
                            {product.ownerUsername}
                          </span>
                        </div>

                        {!closed ? (
                          <div className={`text-center p-2 rounded ${urgent ? "bg-danger-subtle" : "bg-info-subtle"}`}>
                            <LiveCountdown
                              endAt={product.endAt}
                              urgent={urgent}
                              onExpire={() => {}}
                            />
                          </div>
                        ) : (
                          <div className="text-center p-2 rounded bg-secondary-subtle">
                            <small className="text-dark">
                              <i className="bi bi-clock-history me-1"></i>
                              Cerrada {formatAuctionEndDate(product.closedAt)}
                            </small>
                            {product.winnerUsername && (
                              <div className="mt-1">
                                <small className="text-success fw-semibold">
                                  <i className="bi bi-trophy-fill me-1"></i>
                                  Ganador: {product.winnerUsername}
                                </small>
                              </div>
                            )}
                          </div>
                        )}

                        <button
                          className="btn btn-outline-primary w-100 mt-3"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
