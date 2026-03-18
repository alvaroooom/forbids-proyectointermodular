import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/home.css";
import { clearAuthSession, fetchCurrentUser, getAuthSession, saveAuthSession } from "../utils/auth";
import { formatAuctionEndDate, isAuctionClosed, isAuctionUrgent } from "../utils/auctionTime";
import { getCategoryLabel, getCategoryBadgeClass } from "../utils/categories";
import Navbar from "../components/Navbar";
import LiveCountdown from "../components/LiveCountdown";

export default function Profile() {
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
  const [searchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "products");
  
  // Estados para la pestaña de productos
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getStoredItemsPerPage);
  const [jumpPage, setJumpPage] = useState("1");
  const [myProducts, setMyProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  
  // Estados para la pestaña de editar perfil
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    profileImageUrl: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Estados para la pestaña de favoritos
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");

  // Estados para la pestaña de estadísticas
  const [statistics, setStatistics] = useState(null);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(false);
  const [statisticsError, setStatisticsError] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab || "products");
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      try {
        const user = await fetchCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
          setProfileData({
            username: user.username || "",
            email: user.email || "",
            currentPassword: "",
            newPassword: "",
            profileImageUrl: user.profileImageUrl || "",
          });
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
    if (activeTab !== "favorites" || !currentUser) return;

    let isMounted = true;
    setIsLoadingFavorites(true);
    setFavoritesError("");

    const loadFavorites = async () => {
      const session = getAuthSession();
      if (!session?.token) return;

      try {
        const response = await fetch("http://localhost:8080/api/favorites", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "Error al cargar favoritos");
        }

        if (isMounted) {
          setFavorites(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setFavoritesError(error.message || "Error al cargar favoritos");
        }
      } finally {
        if (isMounted) {
          setIsLoadingFavorites(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (activeTab !== "statistics" || !currentUser) return;

    let isMounted = true;
    setIsLoadingStatistics(true);
    setStatisticsError("");

    const loadStatistics = async () => {
      const session = getAuthSession();
      if (!session?.token) return;

      try {
        const response = await fetch("http://localhost:8080/api/statistics/me", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Error al cargar estadísticas");
        }

        if (isMounted) {
          setStatistics(data);
        }
      } catch (error) {
        if (isMounted) {
          setStatisticsError(error.message || "Error al cargar estadísticas");
        }
      } finally {
        if (isMounted) {
          setIsLoadingStatistics(false);
        }
      }
    };

    loadStatistics();

    return () => {
      isMounted = false;
    };
  }, [activeTab, currentUser]);

  useEffect(() => {
    let isMounted = true;

    const loadMyProducts = async () => {
      if (!currentUser) {
        return;
      }

      const session = getAuthSession();
      if (!session?.token) {
        clearAuthSession();
        navigate("/login");
        return;
      }

      setIsLoadingProducts(true);
      setProductsError("");

      try {
        const response = await fetch(
          `http://localhost:8080/api/products/mine?status=${statusFilter}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "No se pudieron cargar tus subastas");
        }

        if (isMounted) {
          setMyProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setMyProducts([]);
          setProductsError(
            error.message || "Error inesperado cargando tus subastas"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadMyProducts();

    return () => {
      isMounted = false;
    };
  }, [currentUser, statusFilter, navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, minPrice, maxPrice, sortBy, itemsPerPage]);

  useEffect(() => {
    if (typeof window === "undefined" || !currentUser?.id) {
      return;
    }

    window.localStorage.setItem(
      `forbids.itemsPerPage.${currentUser.id}`,
      String(itemsPerPage)
    );
  }, [currentUser?.id, itemsPerPage]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileError("");
    setProfileSuccess("");
  };

  const handleRemoveProfileImage = () => {
    setProfileData((prev) => ({ ...prev, profileImageUrl: "" }));
    setProfileError("");
    setProfileSuccess("");
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setIsUpdatingProfile(true);

    try {
      const session = getAuthSession();
      if (!session?.token) {
        throw new Error("Tu sesión ha caducado");
      }

      const updateData = {};
      if (profileData.username && profileData.username !== currentUser.username) {
        updateData.username = profileData.username;
      }
      if (profileData.email && profileData.email !== currentUser.email) {
        updateData.email = profileData.email;
      }
      if (profileData.newPassword) {
        if (!profileData.currentPassword) {
          throw new Error("Introduce tu contraseña actual");
        }
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }
      if (profileData.profileImageUrl !== (currentUser.profileImageUrl || "")) {
        updateData.profileImageUrl = profileData.profileImageUrl;
      }

      if (Object.keys(updateData).length === 0) {
        setProfileError("No hay cambios para guardar");
        return;
      }

      const response = await fetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      // Persistir sesión actualizada (misma clave/almacenamiento en toda la app)
      if (data.token) {
        saveAuthSession(data);
      }

      setCurrentUser({
        id: data.id,
        username: data.username,
        email: data.email,
        profileImageUrl: data.profileImageUrl,
      });

      setProfileData({
        username: data.username,
        email: data.email,
        currentPassword: "",
        newPassword: "",
        profileImageUrl: data.profileImageUrl || "",
      });

      setProfileSuccess("Perfil actualizado correctamente");
    } catch (error) {
      setProfileError(error.message || "Error al actualizar perfil");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const avatarInitials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : "FB";

  const minPriceValue = Number(minPrice);
  const maxPriceValue = Number(maxPrice);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const hasMinPrice = minPrice.trim() !== "" && Number.isFinite(minPriceValue);
  const hasMaxPrice = maxPrice.trim() !== "" && Number.isFinite(maxPriceValue);
  const hasActiveFilters =
    normalizedQuery.length > 0 ||
    statusFilter !== "all" ||
    hasMinPrice ||
    hasMaxPrice ||
    sortBy !== "default";

  const filteredMyProducts = myProducts.filter((product) => {
    const currentPrice = Number(product.currentPrice ?? 0);
    const isClosed = isAuctionClosed(product.endAt, product.closed);
    const searchableText = [
      product.title,
      product.description,
      product.winnerUsername,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && !isClosed) ||
      (statusFilter === "closed" && isClosed);

    return (
      matchesStatus &&
      matchesQuery &&
      (!hasMinPrice || currentPrice >= minPriceValue) &&
      (!hasMaxPrice || currentPrice <= maxPriceValue)
    );
  });

  const sortedMyProducts = [...filteredMyProducts].sort((left, right) => {
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

  const activeProducts = myProducts.filter(
    (product) => !isAuctionClosed(product.endAt, product.closed)
  );

  const totalPages = Math.max(1, Math.ceil(sortedMyProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedMyProducts = sortedMyProducts.slice(
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
      <Navbar currentUser={currentUser} />

      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            {currentUser?.profileImageUrl ? (
              <img 
                src={currentUser.profileImageUrl} 
                alt={currentUser.username}
                className="rounded-circle shadow-sm"
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'cover',
                  border: '4px solid #fff',
                  boxShadow: '0 0 0 2px #0d6efd'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="rounded-circle bg-primary text-white fw-bold shadow-sm"
              style={{
                width: '100px',
                height: '100px',
                fontSize: '32px',
                display: currentUser?.profileImageUrl ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid #fff',
                boxShadow: '0 0 0 2px #0d6efd',
              }}
            >
              {avatarInitials}
            </div>
            <div>
              <h1 className="h4 fw-bold mb-1">{currentUser?.username}</h1>
              <p className="text-muted mb-2">{currentUser?.email}</p>
              <div className="d-flex gap-3">
                <span className="badge bg-light text-dark border">
                  <i className="bi bi-bag me-1"></i>
                  {activeProducts.length} productos
                </span>
                <span className="badge bg-light text-dark border">
                  <i className="bi bi-heart-fill text-danger me-1"></i>
                  {favorites.length} favoritos
                </span>
              </div>
            </div>
          </div>
          <Link to="/products/new" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i>
            Publicar producto
          </Link>
        </div>

        {/* Pestañas */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
              type="button"
              role="tab"
            >
              <i className="bi bi-bag me-2"></i>
              Mis Productos
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => setActiveTab("edit")}
              type="button"
              role="tab"
            >
              <i className="bi bi-person-gear me-2"></i>
              Editar Perfil
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "statistics" ? "active" : ""}`}
              onClick={() => setActiveTab("statistics")}
              type="button"
              role="tab"
            >
              <i className="bi bi-graph-up me-2"></i>
              Estadísticas
            </button>
          </li>
        </ul>

        {/* Contenido de las pestañas */}
        {activeTab === "products" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">Mis subastas</h2>
              <span className="text-muted small">{sortedMyProducts.length} resultados</span>
            </div>

        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar en mis subastas..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{ minWidth: "220px", maxWidth: "320px" }}
          />
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
          <p className="text-muted text-center">Cargando tus subastas...</p>
        ) : productsError ? (
          <div className="alert alert-danger" role="alert">
            {productsError}
          </div>
        ) : sortedMyProducts.length === 0 ? (
          <p className="text-muted text-center">
            {hasActiveFilters
              ? "No hay resultados para los filtros actuales."
              : "No tienes subastas para este filtro."}
          </p>
        ) : (
          <>
            <div className="row g-3">
              {paginatedMyProducts.map((product) => {
              const closed = isAuctionClosed(product.endAt, product.closed);
              const urgent = isAuctionUrgent(product.endAt, closed);

              return (
                <div className="col-md-6 col-lg-4" key={product.id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h3 className="h6 fw-bold mb-0">{product.title}</h3>
                        <div className="d-flex flex-column align-items-end gap-1">
                          <span
                            className={`badge ${
                              closed ? "bg-secondary" : "bg-success"
                            }`}
                          >
                            {closed ? "Cerrada" : "Abierta"}
                          </span>
                          {urgent && <span className="badge bg-danger">Último día</span>}
                        </div>
                      </div>
                      <p className="text-muted small flex-grow-1 mb-3">
                        {product.description}
                      </p>

                      <div className="small text-muted mb-1">
                        Precio actual: <strong>{Number(product.currentPrice || 0).toFixed(2)} €</strong>
                      </div>
                      <div className="small text-muted mb-1">
                        Pujas: <strong>{product.bidsCount || 0}</strong>
                      </div>
                      <div className="small text-muted mb-1">
                        Finaliza: <strong>{formatAuctionEndDate(product.endAt)}</strong>
                      </div>
                      <div className="small mb-1">
                        Tiempo restante: <LiveCountdown endDate={product.endAt} isClosed={closed} size="sm" />
                      </div>
                      {closed && (
                        <div className="small text-muted mb-3">
                          {product.winnerUsername
                            ? `Ganador: ${product.winnerUsername}`
                            : "Sin ganador"}
                        </div>
                      )}

                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-sm btn-outline-secondary mt-auto"
                      >
                        Ver detalle
                      </Link>
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
        )}

        {/* Pestaña de Editar Perfil */}
        {activeTab === "edit" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">
              <h2 className="h5 fw-bold mb-4">Editar mi perfil</h2>

              {profileSuccess && (
                <div className="alert alert-success" role="alert">
                  {profileSuccess}
                </div>
              )}

              {profileError && (
                <div className="alert alert-danger" role="alert">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="form-label small fw-600">Imagen de perfil (URL)</label>
                  <input
                    type="url"
                    name="profileImageUrl"
                    className="form-control"
                    placeholder="https://ejemplo.com/mi-foto.jpg"
                    value={profileData.profileImageUrl}
                    onChange={handleProfileChange}
                    maxLength={500}
                  />
                  <div className="form-text">
                    Añade la URL de una imagen para tu perfil. Se recomienda que sea cuadrada.
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemoveProfileImage}
                      disabled={!profileData.profileImageUrl && !currentUser?.profileImageUrl}
                    >
                      Quitar foto
                    </button>
                    {currentUser?.profileImageUrl && !profileData.profileImageUrl && (
                      <span className="small text-muted">
                        La foto se eliminara al guardar cambios.
                      </span>
                    )}
                  </div>
                  {profileData.profileImageUrl && (
                    <div className="mt-3 text-center">
                      <div className="d-inline-block position-relative">
                        <img 
                          src={profileData.profileImageUrl} 
                          alt="Vista previa"
                          className="rounded-circle shadow"
                          style={{ 
                            width: '150px', 
                            height: '150px', 
                            objectFit: 'cover',
                            border: '4px solid #fff',
                            boxShadow: '0 0 0 2px #0d6efd'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div 
                          className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid white'
                          }}
                        >
                          <i className="bi bi-check-lg"></i>
                        </div>
                      </div>
                      <p className="text-muted small mt-2 mb-0">Vista previa de tu nueva foto de perfil</p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-600">Nombre de usuario</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    minLength={3}
                    maxLength={50}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <hr className="my-4" />

                <h3 className="h6 fw-bold mb-3">Cambiar contraseña (opcional)</h3>

                <div className="mb-3">
                  <label className="form-label small fw-600">Contraseña actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control"
                    placeholder="Deja en blanco si no quieres cambiarla"
                    value={profileData.currentPassword}
                    onChange={handleProfileChange}
                    minLength={6}
                    maxLength={100}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-600">Nueva contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="Deja en blanco si no quieres cambiarla"
                    value={profileData.newPassword}
                    onChange={handleProfileChange}
                    minLength={6}
                    maxLength={100}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "statistics" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">Mis Estadísticas</h2>
            </div>

            {isLoadingStatistics ? (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="text-muted mt-3 mb-0">Cargando estadísticas...</p>
                </div>
              </div>
            ) : statisticsError ? (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {statisticsError}
              </div>
            ) : statistics ? (
              <div>
                {/* Estadísticas de pujas */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-body p-4">
                    <h3 className="h6 fw-bold mb-3 d-flex align-items-center">
                      <i className="bi bi-hammer text-primary me-2"></i>
                      Actividad en Subastas
                    </h3>
                    <div className="row g-3">
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-primary">{statistics.totalBids}</div>
                          <div className="small text-muted mt-2">Pujas Realizadas</div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-success">{statistics.wonAuctions}</div>
                          <div className="small text-muted mt-2">Subastas Ganadas</div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-info">{statistics.successRate.toFixed(1)}%</div>
                          <div className="small text-muted mt-2">Tasa de Éxito</div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-warning">{statistics.totalSpent.toFixed(2)}€</div>
                          <div className="small text-muted mt-2">Total Gastado</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas de productos */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-body p-4">
                    <h3 className="h6 fw-bold mb-3 d-flex align-items-center">
                      <i className="bi bi-bag text-primary me-2"></i>
                      Mis Productos
                    </h3>
                    <div className="row g-3">
                      <div className="col-md-4 col-6">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-success">{statistics.activeProducts}</div>
                          <div className="small text-muted mt-2">Productos Activos</div>
                        </div>
                      </div>
                      <div className="col-md-4 col-6">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-secondary">{statistics.closedProducts}</div>
                          <div className="small text-muted mt-2">Productos Cerrados</div>
                        </div>
                      </div>
                      <div className="col-md-4 col-6">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-primary">{statistics.receivedBids}</div>
                          <div className="small text-muted mt-2">Pujas Recibidas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadística de favoritos */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h3 className="h6 fw-bold mb-3 d-flex align-items-center">
                      <i className="bi bi-heart text-danger me-2"></i>
                      Favoritos
                    </h3>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <div className="text-center p-3 rounded-3" style={{backgroundColor: '#f8f9fa'}}>
                          <div className="display-6 fw-bold text-danger">{statistics.totalFavorites}</div>
                          <div className="small text-muted mt-2">Productos en Favoritos</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen de rendimiento */}
                {statistics.totalBids > 0 && (
                  <div className="alert alert-info mt-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-info-circle fs-4 me-3"></i>
                      <div>
                        <strong>Resumen de tu actividad:</strong>
                        <div className="mt-2">
                          {statistics.wonAuctions > 0 ? (
                            <span>
                              Has ganado <strong>{statistics.wonAuctions}</strong> de <strong>{statistics.totalBids}</strong> pujas realizadas,
                              con una tasa de éxito del <strong>{statistics.successRate.toFixed(1)}%</strong>.
                              {statistics.totalSpent > 0 && (
                                <span> Has gastado un total de <strong>{statistics.totalSpent.toFixed(2)}€</strong> en subastas ganadas.</span>
                              )}
                            </span>
                          ) : (
                            <span>
                              Has realizado <strong>{statistics.totalBids}</strong> pujas pero aún no has ganado ninguna subasta.
                              ¡Sigue intentándolo!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                No se pudieron cargar las estadísticas.
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">
              <h2 className="h5 fw-bold mb-4">Configuración</h2>
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Esta sección está en desarrollo. Próximamente podrás gestionar tus preferencias de notificaciones, privacidad y más.
              </div>
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">Mis Favoritos</h2>
              <span className="text-muted small">{favorites.length} productos</span>
            </div>

            {isLoadingFavorites ? (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-5 text-center">
                  <p className="text-muted mb-0">Cargando favoritos...</p>
                </div>
              </div>
            ) : favoritesError ? (
              <div className="alert alert-danger" role="alert">
                {favoritesError}
              </div>
            ) : favorites.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-5 text-center">
                  <i className="bi bi-heart fs-1 text-muted mb-3 d-block"></i>
                  <p className="text-muted mb-3">No tienes productos en favoritos todavía</p>
                  <Link to="/home" className="btn btn-primary">
                    Explorar productos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {favorites.map((favorite) => {
                  const closed = isAuctionClosed(favorite.productEndAt, favorite.productClosed);
                  const urgent = isAuctionUrgent(favorite.productEndAt, closed);

                  return (
                    <div className="col-md-6 col-lg-4" key={favorite.id}>
                      <div className="card h-100 border-0 shadow-sm rounded-4">
                        {favorite.productImageUrl && (
                          <img 
                            src={favorite.productImageUrl} 
                            alt={favorite.productTitle}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover', borderRadius: '1rem 1rem 0 0' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <div className="flex-grow-1">
                              <h3 className="h6 fw-bold mb-1">{favorite.productTitle}</h3>
                              {favorite.productCategory && (
                                <span className={`badge ${getCategoryBadgeClass(favorite.productCategory)} badge-sm`}>
                                  {getCategoryLabel(favorite.productCategory)}
                                </span>
                              )}
                            </div>
                            <div className="d-flex flex-column align-items-end gap-1">
                              <span className={`badge ${closed ? "bg-secondary" : "bg-success"}`}>
                                {closed ? "Cerrada" : "Abierta"}
                              </span>
                              {urgent && <span className="badge bg-danger">Último día</span>}
                            </div>
                          </div>
                          <p className="text-muted small flex-grow-1 mb-3">
                            {favorite.productDescription}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-primary">
                              {Number(favorite.productCurrentPrice || 0).toFixed(2)} €
                            </span>
                            <span className="small text-muted">
                              por {favorite.productOwnerUsername}
                            </span>
                          </div>
                          <div className="small text-muted mb-1">
                            Finaliza: <strong>{formatAuctionEndDate(favorite.productEndAt)}</strong>
                          </div>
                          <div className="small mb-3">
                            Tiempo restante: <LiveCountdown endDate={favorite.productEndAt} isClosed={closed} size="sm" />
                          </div>

                          <Link
                            to={`/products/${favorite.productId}`}
                            className="btn btn-sm btn-primary w-100"
                          >
                            Ver detalle
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
