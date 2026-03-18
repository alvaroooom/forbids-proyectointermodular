import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { clearAuthSession, fetchCurrentUser, getAuthSession } from "../utils/auth";
import { formatAuctionEndDate, isAuctionClosed, isAuctionUrgent } from "../utils/auctionTime";
import { getCategoryLabel, getCategoryBadgeClass } from "../utils/categories";
import Navbar from "../components/Navbar";
import LiveCountdown from "../components/LiveCountdown";

export default function Home() {
  const PAGE_SIZE_OPTIONS = [15, 30, 60];
  const DEFAULT_PAGE_SIZE = 15;

  const getStoredItemsPerPage = () => {
    if (typeof window === "undefined") {
      return DEFAULT_PAGE_SIZE;
    }

    const session = getAuthSession();
    const userId = session?.user?.id;

    if (!userId) {
      return DEFAULT_PAGE_SIZE;
    }

    const storedValue = Number(
      window.localStorage.getItem(`forbids.itemsPerPage.${userId}`)
    );

    return PAGE_SIZE_OPTIONS.includes(storedValue)
      ? storedValue
      : DEFAULT_PAGE_SIZE;
  };

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getStoredItemsPerPage);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [bidAmounts, setBidAmounts] = useState({});
  const [bidErrors, setBidErrors] = useState({});
  const [submittingBidProductId, setSubmittingBidProductId] = useState(null);
  const [jumpPage, setJumpPage] = useState("1");
  const [favorites, setFavorites] = useState(new Set());
  const [togglingFavorite, setTogglingFavorite] = useState(null);

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

    const loadFavorites = async () => {
      const session = getAuthSession();
      if (!session?.token) return;

      try {
        const response = await fetch("http://localhost:8080/api/favorites", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const favoriteIds = new Set(data.map(fav => fav.productId));
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
      }
    };

    loadFavorites();
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos");
        }

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
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
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, minPrice, maxPrice, sortBy, itemsPerPage]);

  useEffect(() => {
    if (typeof window === "undefined" || !currentUser?.id) {
      return;
    }

    window.localStorage.setItem(
      `forbids.itemsPerPage.${currentUser.id}`,
      String(itemsPerPage)
    );
  }, [currentUser?.id, itemsPerPage]);

  const refreshProducts = async () => {
    const response = await fetch("http://localhost:8080/api/products");
    const data = await response.json().catch(() => []);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los productos");
    }

    setProducts(Array.isArray(data) ? data : []);
  };

  const handleBidAmountChange = (productId, value) => {
    setBidAmounts((prev) => ({ ...prev, [productId]: value }));
    setBidErrors((prev) => ({ ...prev, [productId]: "" }));
  };

  const handlePlaceBid = async (event, product) => {
    event.preventDefault();

    const session = getAuthSession();
    if (!session?.token) {
      setBidErrors((prev) => ({
        ...prev,
        [product.id]: "Tu sesión ha caducado, vuelve a iniciar sesión",
      }));
      return;
    }

    const amountValue = bidAmounts[product.id];
    const parsedAmount = Number(amountValue);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setBidErrors((prev) => ({
        ...prev,
        [product.id]: "Introduce una puja válida",
      }));
      return;
    }

    setSubmittingBidProductId(product.id);
    setBidErrors((prev) => ({ ...prev, [product.id]: "" }));

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${product.id}/bids`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ amount: parsedAmount }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "No se pudo registrar la puja");
      }

      setBidAmounts((prev) => ({ ...prev, [product.id]: "" }));
      await refreshProducts();
    } catch (error) {
      setBidErrors((prev) => ({
        ...prev,
        [product.id]: error.message || "Error al pujar",
      }));
    } finally {
      setSubmittingBidProductId(null);
    }
  };

  const toggleFavorite = async (productId) => {
    const session = getAuthSession();
    if (!session?.token) return;

    setTogglingFavorite(productId);
    const isFavorite = favorites.has(productId);

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(`http://localhost:8080/api/favorites/${productId}`, {
        method: method,
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (response.ok) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorite) {
            newFavorites.delete(productId);
          } else {
            newFavorites.add(productId);
          }
          return newFavorites;
        });
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    } finally {
      setTogglingFavorite(null);
    }
  };

  const handleShare = async (productId, productTitle) => {
    const url = `${window.location.origin}/products/${productId}`;
    
    // Si el navegador soporta Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          text: `Mira esta subasta: ${productTitle}`,
          url: url,
        });
      } catch (error) {
        // Usuario canceló o error - copiar al portapapeles como fallback
        if (error.name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      // Fallback: copiar al portapapeles
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('¡Enlace copiado al portapapeles!');
      }).catch(() => {
        fallbackCopyToClipboard(text);
      });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('¡Enlace copiado al portapapeles!');
    } catch (err) {
      alert('No se pudo copiar el enlace');
    }
    document.body.removeChild(textArea);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const minPriceValue = Number(minPrice);
  const maxPriceValue = Number(maxPrice);
  const hasMinPrice = minPrice.trim() !== "" && Number.isFinite(minPriceValue);
  const hasMaxPrice = maxPrice.trim() !== "" && Number.isFinite(maxPriceValue);
  const hasActiveFilters =
    normalizedQuery.length > 0 ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    hasMinPrice ||
    hasMaxPrice ||
    sortBy !== "default";

  const filteredProducts = products.filter((product) => {
    const isClosed = isAuctionClosed(product.endAt, product.closed);
    const currentPrice = Number(product.currentPrice ?? 0);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && !isClosed) ||
      (statusFilter === "closed" && isClosed);

    const matchesCategory =
      categoryFilter === "all" ||
      product.category === categoryFilter;

    const matchesPrice =
      (!hasMinPrice || currentPrice >= minPriceValue) &&
      (!hasMaxPrice || currentPrice <= maxPriceValue);

    const searchableText = [
      product.title,
      product.description,
      product.ownerUsername,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesStatus && matchesCategory && matchesQuery && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((left, right) => {
    if (sortBy === "priceAsc") {
      return Number(left.currentPrice ?? 0) - Number(right.currentPrice ?? 0);
    }

    if (sortBy === "priceDesc") {
      return Number(right.currentPrice ?? 0) - Number(left.currentPrice ?? 0);
    }

    if (sortBy === "endingSoon") {
      const leftTime = left.endAt ? new Date(left.endAt).getTime() : Number.MAX_SAFE_INTEGER;
      const rightTime = right.endAt ? new Date(right.endAt).getTime() : Number.MAX_SAFE_INTEGER;
      return leftTime - rightTime;
    }

    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = sortedProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  useEffect(() => {
    setJumpPage(String(safeCurrentPage));
  }, [safeCurrentPage]);

  const handleJumpPageSubmit = (event) => {
    event.preventDefault();

    const parsedPage = Number(jumpPage);
    if (!Number.isFinite(parsedPage)) {
      setJumpPage(String(safeCurrentPage));
      return;
    }

    const targetPage = Math.min(totalPages, Math.max(1, Math.trunc(parsedPage)));
    setCurrentPage(targetPage);
    setJumpPage(String(targetPage));
  };

  if (isCheckingSession) {
    return (
      <div className="main-content d-flex justify-content-center align-items-center">
        <p className="text-muted mb-0">Comprobando sesión...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Navbar 
        currentUser={currentUser} 
        showSearch={true} 
        searchQuery={searchQuery} 
        onSearchChange={(event) => setSearchQuery(event.target.value)}
      />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 fw-bold mb-0">Productos publicados</h2>
          <span className="text-muted small">{sortedProducts.length} resultados</span>
        </div>

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
              statusFilter === "closed"
                ? "btn-primary"
                : "btn-outline-primary"
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

          <div className="d-flex align-items-center gap-2 ms-md-auto">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              style={{ maxWidth: "180px" }}
            >
              <option value="default">Orden: por defecto</option>
              <option value="endingSoon">Terminan antes</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
            </select>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Precio mín."
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              style={{ maxWidth: "130px" }}
            />
            <span className="text-muted small">-</span>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Precio máx."
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              style={{ maxWidth: "130px" }}
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setMinPrice("");
                setMaxPrice("");
                setSortBy("default");
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {isLoadingProducts ? (
          <p className="text-muted text-center">Cargando productos...</p>
        ) : sortedProducts.length === 0 ? (
          <p className="text-muted text-center">
            {hasActiveFilters
              ? "No hay resultados para los filtros actuales."
              : "Aún no hay productos. Sé el primero en publicar uno."}
          </p>
        ) : (
          <>
            <div className="row g-3">
              {paginatedProducts.map((product) => {
              const closed = isAuctionClosed(product.endAt, product.closed);
              const urgent = isAuctionUrgent(product.endAt, closed);

              return (
                <div className="col-md-6 col-lg-4" key={product.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h3 className="h6 fw-bold mb-0">{product.title}</h3>
                        <div className="d-flex flex-column align-items-end gap-1">
                          {product.category && (
                            <span className={getCategoryBadgeClass(product.category)} style={{ fontSize: '0.7rem' }}>
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
                        <span className="small text-muted">
                          por {product.ownerUsername}
                        </span>
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
                        Tiempo restante:{" "}
                        <LiveCountdown 
                          endDate={product.endAt} 
                          isClosed={closed}
                          size="sm"
                        />
                      </div>

                      {/* Barra de acciones estilo Instagram */}
                      <div className="d-flex gap-3 mb-3 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                        <button
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => toggleFavorite(product.id)}
                          disabled={togglingFavorite === product.id}
                          title={favorites.has(product.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                        >
                          <i className={`bi ${favorites.has(product.id) ? 'bi-heart-fill text-danger' : 'bi-heart'} fs-5`}></i>
                        </button>
                        <Link
                          to={`/products/${product.id}#comments-section`}
                          className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                          style={{ color: 'var(--text-primary)' }}
                          title="Comentarios"
                          onClick={() => {
                            setTimeout(() => {
                              const element = document.getElementById('comments-section');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }}
                        >
                          <i className="bi bi-chat fs-5"></i>
                          {product.commentsCount > 0 && (
                            <span className="small">{product.commentsCount}</span>
                          )}
                        </Link>
                        <button
                          className="btn btn-link p-0 text-decoration-none"
                          style={{ color: 'var(--text-primary)' }}
                          title="Compartir"
                          onClick={() => handleShare(product.id, product.title)}
                        >
                          <i className="bi bi-share fs-5"></i>
                        </button>
                      </div>

                      {closed && (
                        <div className="small text-muted mb-3">
                          {product.winnerUsername
                            ? `Ganador: ${product.winnerUsername}`
                            : "Cerrada sin pujas"}
                        </div>
                      )}

                      <div className="mb-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="btn btn-sm btn-outline-secondary w-100"
                        >
                          Ver detalle
                        </Link>
                      </div>

                      {currentUser?.id !== product.ownerId && !closed && (
                        <form onSubmit={(event) => handlePlaceBid(event, product)}>
                          <div className="input-group input-group-sm">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Tu puja (€)"
                              min="0.01"
                              step="0.01"
                              value={bidAmounts[product.id] || ""}
                              onChange={(event) =>
                                handleBidAmountChange(product.id, event.target.value)
                              }
                              required
                            />
                            <button
                              type="submit"
                              className="btn btn-outline-primary"
                              disabled={submittingBidProductId === product.id}
                            >
                              {submittingBidProductId === product.id
                                ? "Pujando..."
                                : "Pujar"}
                            </button>
                          </div>
                          {bidErrors[product.id] && (
                            <div className="text-danger small mt-2">
                              {bidErrors[product.id]}
                            </div>
                          )}
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
              <div className="d-flex align-items-center gap-1">
                <span className="text-muted small">Por página</span>
                <select
                  className="form-select form-select-sm"
                  value={itemsPerPage}
                  onChange={(event) => setItemsPerPage(Number(event.target.value))}
                  style={{ maxWidth: "85px" }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {totalPages > 1 && (
                <>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    Primera
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={safeCurrentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  >
                    Anterior
                  </button>
                  <span className="text-muted small">
                    Página {safeCurrentPage} de {totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    Siguiente
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    Última
                  </button>
                  <form className="d-flex align-items-center gap-1" onSubmit={handleJumpPageSubmit}>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      className="form-control form-control-sm"
                      value={jumpPage}
                      onChange={(event) => setJumpPage(event.target.value)}
                      style={{ maxWidth: "80px" }}
                    />
                    <button type="submit" className="btn btn-sm btn-outline-secondary">
                      Ir
                    </button>
                  </form>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
