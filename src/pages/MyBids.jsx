import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { clearAuthSession, fetchCurrentUser, getAuthSession } from "../utils/auth";
import { formatAuctionEndDate, isAuctionClosed, isAuctionUrgent } from "../utils/auctionTime";
import { getCategoryLabel, getCategoryBadgeClass } from "../utils/categories";
import Navbar from "../components/Navbar";
import LiveCountdown from "../components/LiveCountdown";

export default function MyBids() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      try {
        const user = await fetchCurrentUser();
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
    if (!currentUser) return;

    const loadMyBids = async () => {
      setIsLoadingProducts(true);
      const session = getAuthSession();
      
      if (!session?.token) {
        setIsLoadingProducts(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/bids/my-bids", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Error al cargar mis pujas");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadMyBids();
  }, [currentUser]);

  if (isCheckingSession) {
    return (
      <div className="main-content d-flex justify-content-center align-items-center">
        <p className="text-muted mb-0">Comprobando sesión...</p>
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    const isClosed = isAuctionClosed(product.endAt, product.closed);
    
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && !isClosed) ||
      (statusFilter === "closed" && isClosed);

    const matchesCategory =
      categoryFilter === "all" ||
      product.category === categoryFilter;

    return matchesStatus && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aClosed = isAuctionClosed(a.endAt, a.closed);
    const bClosed = isAuctionClosed(b.endAt, b.closed);

    switch (sortBy) {
      case "endingSoon":
        if (aClosed && !bClosed) return 1;
        if (!aClosed && bClosed) return -1;
        if (aClosed && bClosed) return 0;
        return new Date(a.endAt) - new Date(b.endAt);
      case "priceAsc":
        return Number(a.currentPrice) - Number(b.currentPrice);
      case "priceDesc":
        return Number(b.currentPrice) - Number(a.currentPrice);
      default:
        return 0;
    }
  });

  return (
    <div className="main-content">
      <Navbar
        currentUser={currentUser}
        onLogout={() => {
          clearAuthSession();
          navigate("/login");
        }}
      />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 fw-bold mb-0">Mis Pujas</h2>
          <span className="text-muted small">{sortedProducts.length} productos</span>
        </div>

        <p className="text-muted mb-4">
          Productos en los que has realizado pujas
        </p>

        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          <button
            type="button"
            className={`btn btn-sm ${
              statusFilter === "all" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            Todas
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              statusFilter === "open" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setStatusFilter("open")}
          >
            Abiertas
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              statusFilter === "closed" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setStatusFilter("closed")}
          >
            Cerradas
          </button>

          <div className="vr d-none d-md-inline mx-1"></div>

          <select
            className="form-select form-select-sm"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            style={{ maxWidth: "175px" }}
          >
            <option value="all">Todas las categorías</option>
            <option value="ELECTRONICS">Electrónica</option>
            <option value="FASHION">Moda</option>
            <option value="HOME">Hogar</option>
            <option value="SPORTS">Deportes</option>
            <option value="BOOKS">Libros</option>
            <option value="TOYS">Juguetes</option>
            <option value="AUTOMOTIVE">Automóviles</option>
            <option value="ART">Arte</option>
            <option value="MUSIC">Música</option>
            <option value="OTHER">Otros</option>
          </select>

          <select
            className="form-select form-select-sm ms-md-auto"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            style={{ maxWidth: "180px" }}
          >
            <option value="default">Orden: por defecto</option>
            <option value="endingSoon">Terminan antes</option>
            <option value="priceAsc">Precio: menor a mayor</option>
            <option value="priceDesc">Precio: mayor a menor</option>
          </select>
        </div>

        {isLoadingProducts ? (
          <p className="text-muted text-center">Cargando productos...</p>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <p className="text-muted mt-3">
              {products.length === 0 
                ? "No has realizado ninguna puja todavía" 
                : "No hay productos que coincidan con los filtros"}
            </p>
            <Link to="/home" className="btn btn-primary mt-2">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {sortedProducts.map((product) => {
              const closed = isAuctionClosed(product.endAt, product.closed);
              const urgent = isAuctionUrgent(product.endAt, closed);
              const isWinner = product.winnerId === currentUser?.id;

              return (
                <div className="col-md-6 col-lg-4" key={product.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
                    {isWinner && closed && (
                      <div 
                        className="position-absolute top-0 start-0 m-2 bg-success text-white rounded-3 px-3 py-1"
                        style={{ zIndex: 10, fontSize: '0.85rem', fontWeight: '600' }}
                      >
                        <i className="bi bi-trophy-fill me-1"></i>
                        ¡Ganaste!
                      </div>
                    )}
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover", borderRadius: "1rem 1rem 0 0" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h3 className="h6 fw-bold mb-0">{product.title}</h3>
                        <div className="d-flex flex-column align-items-end gap-1">
                          {product.category && (
                            <span className={getCategoryBadgeClass(product.category)} style={{ fontSize: "0.7rem" }}>
                              {getCategoryLabel(product.category)}
                            </span>
                          )}
                          <span className={`badge ${closed ? "bg-secondary" : "bg-success"}`}>
                            {closed ? "Cerrada" : "Abierta"}
                          </span>
                          {urgent && <span className="badge bg-danger">Último día</span>}
                        </div>
                      </div>
                      <p className="text-muted small flex-grow-1 mb-3">
                        {product.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-primary">
                          {Number.isFinite(Number(product.currentPrice))
                            ? Number(product.currentPrice).toFixed(2)
                            : "0.00"}{" "}
                          €
                        </span>
                        <span className="small text-muted">por {product.ownerUsername}</span>
                      </div>
                      <div className="small text-muted mt-1 mb-1">
                        {product.bidsCount || 0} pujas · {product.favoritesCount || 0} <i className="bi bi-heart-fill text-danger"></i> · Precio inicial{" "}
                        {Number.isFinite(Number(product.startingPrice))
                          ? Number(product.startingPrice).toFixed(2)
                          : "0.00"}{" "}
                        €
                      </div>
                      <div className="small text-muted mb-1">
                        Finaliza: <strong>{formatAuctionEndDate(product.endAt)}</strong>
                      </div>
                      <div className="small mb-3">
                        Tiempo restante: <LiveCountdown endDate={product.endAt} isClosed={closed} size="sm" />
                      </div>

                      {closed && (
                        <div className={`small mb-3 ${isWinner ? "text-success fw-bold" : "text-muted"}`}>
                          {isWinner
                            ? "¡Felicidades! Ganaste esta subasta"
                            : product.winnerUsername
                            ? `Ganador: ${product.winnerUsername}`
                            : "Cerrada sin pujas"}
                        </div>
                      )}

                      <Link to={`/products/${product.id}`} className="btn btn-sm btn-primary w-100">
                        Ver detalle y pujas
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
