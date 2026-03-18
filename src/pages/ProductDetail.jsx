import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearAuthSession,
  fetchCurrentUser,
  getAuthSession,
} from "../utils/auth";
import {
  formatAuctionEndDate,
  isAuctionClosed,
  isAuctionUrgent,
} from "../utils/auctionTime";
import { formatRelativeTime, formatFullDate } from "../utils/dateFormat";
import Navbar from "../components/Navbar";
import LiveCountdown from "../components/LiveCountdown";
import "../styles/home.css";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [isClosingAuction, setIsClosingAuction] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyToComment, setReplyToComment] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");

  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const loadProductAndBids = async () => {
    const [productResponse, bidsResponse, commentsResponse] = await Promise.all([
      fetch(`http://localhost:8080/api/products/${productId}`),
      fetch(`http://localhost:8080/api/products/${productId}/bids`),
      fetch(`http://localhost:8080/api/products/${productId}/comments`),
    ]);

    const productData = await productResponse.json().catch(() => ({}));
    const bidsData = await bidsResponse.json().catch(() => []);
    const commentsData = await commentsResponse.json().catch(() => []);

    if (!productResponse.ok) {
      throw new Error(productData.message || "No se pudo cargar el producto");
    }

    if (!bidsResponse.ok) {
      throw new Error("No se pudieron cargar las pujas");
    }

    setProduct(productData);
    setBids(Array.isArray(bidsData) ? bidsData : []);
    setComments(Array.isArray(commentsData) ? commentsData : []);
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const user = await fetchCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
        }

        await loadProductAndBids();
      } catch (error) {
        const message = error.message || "Error cargando detalle";

        if (
          message === "No active session" ||
          message === "Session expired" ||
          message.includes("token")
        ) {
          clearAuthSession();
          if (isMounted) {
            navigate("/login");
          }
          return;
        }

        if (isMounted) {
          setErrorMessage(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [navigate, productId]);

  useEffect(() => {
    // Scroll to comments section if hash is present
    if (window.location.hash === '#comments-section') {
      setTimeout(() => {
        const element = document.getElementById('comments-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const loadSimilarProducts = async () => {
      setIsLoadingSimilar(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${productId}/similar?limit=6`
        );
        const data = await response.json().catch(() => []);
        
        if (response.ok) {
          setSimilarProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error loading similar products:", error);
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    loadSimilarProducts();
  }, [product, productId]);

  const handlePlaceBid = async (event) => {
    event.preventDefault();
    setBidError("");

    const session = getAuthSession();
    if (!session?.token) {
      setBidError("Tu sesión ha caducado, vuelve a iniciar sesión");
      return;
    }

    const parsedAmount = Number(bidAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setBidError("Introduce una puja válida");
      return;
    }

    setIsSubmittingBid(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/bids`,
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

      setBidAmount("");
      await loadProductAndBids();
    } catch (error) {
      setBidError(error.message || "Error al pujar");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleCloseAuction = async () => {
    setErrorMessage("");

    const session = getAuthSession();
    if (!session?.token) {
      setErrorMessage("Tu sesión ha caducado, vuelve a iniciar sesión");
      return;
    }

    setIsClosingAuction(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/close`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "No se pudo cerrar la subasta");
      }

      await loadProductAndBids();
    } catch (error) {
      setErrorMessage(error.message || "Error al cerrar la subasta");
    } finally {
      setIsClosingAuction(false);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    setCommentError("");

    const session = getAuthSession();
    if (!session?.token) {
      setCommentError("Tu sesión ha caducado, vuelve a iniciar sesión");
      return;
    }

    if (!newComment.trim()) {
      setCommentError("El comentario no puede estar vacío");
      return;
    }

    if (newComment.length > 1000) {
      setCommentError("El comentario no puede tener más de 1000 caracteres");
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            content: newComment.trim(),
            parentCommentId: replyToComment?.id || null,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "No se pudo crear el comentario");
      }

      setNewComment("");
      setReplyToComment(null);
      await loadProductAndBids();
    } catch (error) {
      console.error("Error al crear comentario:", error);
      setCommentError(error.message || "Error al crear comentario");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const session = getAuthSession();
    if (!session?.token) {
      alert("Tu sesión ha caducado");
      return;
    }

    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "No se pudo eliminar el comentario");
      }

      await loadProductAndBids();
    } catch (error) {
      alert(error.message || "Error al eliminar comentario");
    }
  };

  if (isLoading) {
    return (
      <div className="main-content d-flex justify-content-center align-items-center">
        <p className="text-muted mb-0">Cargando detalle...</p>
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="main-content py-5">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div className="alert alert-danger" role="alert">
            {errorMessage || "Producto no encontrado"}
          </div>
          <Link to="/home" className="btn btn-outline-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === product.ownerId;
  const isClosed = isAuctionClosed(product.endAt, product.closed);
  const urgent = isAuctionUrgent(product.endAt, isClosed);
  const topLevelComments = comments.filter((comment) => !comment.parentCommentId);
  const repliesByParentId = comments.reduce((acc, comment) => {
    if (!comment.parentCommentId) {
      return acc;
    }

    if (!acc[comment.parentCommentId]) {
      acc[comment.parentCommentId] = [];
    }

    acc[comment.parentCommentId].push(comment);
    return acc;
  }, {});

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="main-content py-4">
      <div className="container" style={{ maxWidth: "920px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/home" className="text-decoration-none text-muted fw-600 small">
            <i className="bi bi-arrow-left me-1"></i> Volver al inicio
          </Link>
          <div className="d-flex gap-2">
            <span className={`badge ${isClosed ? "bg-secondary" : "bg-success"}`}>
              {isClosed ? "Subasta cerrada" : "Subasta abierta"}
            </span>
            {urgent && <span className="badge bg-danger">Último día</span>}
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4 p-md-5">
            {product.imageUrl && (
              <div className="mb-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="w-100 rounded-3"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <h1 className="h4 fw-bold mb-2">{product.title}</h1>
            <p className="text-muted mb-4">{product.description}</p>

            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="small text-muted">Propietario</div>
                <div className="fw-semibold">{product.ownerUsername}</div>
              </div>
              <div className="col-md-3">
                <div className="small text-muted">Precio actual</div>
                <div className="fw-semibold text-primary">
                  {Number(product.currentPrice || 0).toFixed(2)} €
                </div>
              </div>
              <div className="col-md-3">
                <div className="small text-muted">Precio inicial</div>
                <div className="fw-semibold">
                  {Number(product.startingPrice || 0).toFixed(2)} €
                </div>
              </div>
              <div className="col-md-3">
                <div className="small text-muted">Total pujas</div>
                <div className="fw-semibold">{product.bidsCount || 0}</div>
              </div>
            </div>

            <div className="small text-muted mb-1">
              Finaliza: <strong>{formatAuctionEndDate(product.endAt)}</strong>
            </div>
            <div className="mb-4">
              <span className="small text-muted">Tiempo restante: </span>
              <LiveCountdown 
                endDate={product.endAt} 
                isClosed={isClosed}
                size="md"
              />
            </div>

            {isClosed && (
              <div className="alert alert-info py-2 mb-4" role="alert">
                {product.winnerUsername
                  ? `Ganador: ${product.winnerUsername}`
                  : "Subasta cerrada sin pujas"}
              </div>
            )}

            {!isClosed && !isOwner && (
              <form onSubmit={handlePlaceBid}>
                <div className="mb-3">
                  <label className="form-label small fw-600">Tu puja (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0.01"
                    step="0.01"
                    value={bidAmount}
                    onChange={(event) => setBidAmount(event.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmittingBid}
                >
                  {isSubmittingBid ? "Pujando..." : "Pujar"}
                </button>
                {bidError && <div className="text-danger small mt-2">{bidError}</div>}
              </form>
            )}

            {!isClosed && isOwner && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleCloseAuction}
                disabled={isClosingAuction}
              >
                {isClosingAuction ? "Cerrando..." : "Cerrar subasta"}
              </button>
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">Historial de pujas</h2>
              <span className="badge bg-primary">{bids.length} {bids.length === 1 ? 'puja' : 'pujas'}</span>
            </div>
            {bids.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox display-4 text-muted"></i>
                <p className="text-muted mt-3 mb-0">Todavía no hay pujas en este producto.</p>
                <p className="text-muted small">¡Sé el primero en pujar!</p>
              </div>
            ) : (
              <div className="position-relative">
                <div 
                  className="position-absolute d-none d-md-block"
                  style={{
                    left: '28px',
                    top: '20px',
                    bottom: '20px',
                    width: '2px',
                    backgroundColor: '#e9ecef'
                  }}
                ></div>

                {/* lista de pujas */}
                <div className="d-flex flex-column gap-3">
                  {bids.map((bid, index) => {
                    const isHighestBid = index === 0;
                    const isWinningBid = isClosed && product.winnerId === bid.bidderId;
                    const userInitials = bid.bidderUsername ? bid.bidderUsername.slice(0, 2).toUpperCase() : '??';

                    return (
                      <div 
                        key={bid.id} 
                        className={`d-flex gap-3 position-relative ${isHighestBid ? 'bg-light' : ''}`}
                        style={{ 
                          padding: '12px',
                          borderRadius: '12px',
                          ...(isHighestBid && { border: '2px solid #0d6efd' })
                        }}
                      >
                        {/* Avatar */}
                        <div className="position-relative flex-shrink-0">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                            style={{ 
                              width: '56px', 
                              height: '56px',
                              backgroundColor: isHighestBid ? '#0d6efd' : '#6c757d',
                              fontSize: '0.9rem',
                              zIndex: 1
                            }}
                          >
                            {userInitials}
                          </div>
                          {isWinningBid && (
                            <div 
                              className="position-absolute bg-success rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: '24px',
                                height: '24px',
                                bottom: '-4px',
                                right: '-4px',
                                border: '2px solid white'
                              }}
                            >
                              <i className="bi bi-trophy-fill text-white" style={{ fontSize: '0.7rem' }}></i>
                            </div>
                          )}
                        </div>

                        {/* Detalles puja */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                              <span className="fw-bold">{bid.bidderUsername}</span>
                              {isHighestBid && (
                                <span className="badge bg-primary ms-2" style={{ fontSize: '0.7rem' }}>
                                  Puja más alta
                                </span>
                              )}
                              {isWinningBid && (
                                <span className="badge bg-success ms-2" style={{ fontSize: '0.7rem' }}>
                                  <i className="bi bi-trophy-fill me-1"></i>Ganador
                                </span>
                              )}
                            </div>
                            <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                              {Number(bid.amount).toFixed(2)} €
                            </span>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <i className="bi bi-clock"></i>
                            <span title={formatFullDate(bid.createdAt)}>
                              {formatRelativeTime(bid.createdAt)}
                            </span>
                          </div>

                          {bid.imageUrl && (
                            <div className="mt-2">
                              <img 
                                src={bid.imageUrl} 
                                alt="Imagen de la puja"
                                className="rounded-3"
                                style={{ 
                                  maxWidth: '120px', 
                                  height: '80px', 
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                  border: '1px solid #dee2e6'
                                }}
                                onClick={() => window.open(bid.imageUrl, '_blank')}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de comentarios */}
        <div id="comments-section" className="card border-0 shadow-sm rounded-4 mt-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold mb-0">
                <i className="bi bi-chat-left-text me-2"></i>
                Comentarios y Preguntas
              </h2>
              <span className="badge bg-secondary">{comments.length}</span>
            </div>

            {/* Formulario de comentarios */}
            <form onSubmit={handleSubmitComment} className="mb-4">
              <div className="mb-3">
                <label className="form-label small fw-600">
                  Escribe un comentario o pregunta
                </label>
                {replyToComment && (
                  <div className="alert alert-info py-2 d-flex justify-content-between align-items-center mb-2">
                    <span className="small mb-0">
                      Respondiendo a <strong>{replyToComment.username}</strong>
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none p-0"
                      onClick={() => setReplyToComment(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder={
                    replyToComment
                      ? `Escribe tu respuesta para ${replyToComment.username}...`
                      : "¿Tienes alguna pregunta sobre este producto?"
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  maxLength={1000}
                  required
                ></textarea>
                <div className="form-text text-end small">
                  {newComment.length}/1000 caracteres
                </div>
              </div>
              {commentError && (
                <div className="alert alert-danger py-2 mb-3">{commentError}</div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Publicando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    {replyToComment ? "Publicar respuesta" : "Publicar comentario"}
                  </>
                )}
              </button>
            </form>

            <hr className="my-4" />

            {/* Lista de comentarios */}
            {comments.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-chat display-4 text-muted"></i>
                <p className="text-muted mt-3 mb-0">
                  Aún no hay comentarios en este producto
                </p>
                <p className="text-muted small">¡Sé el primero en comentar!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {topLevelComments.map((comment) => {
                  const replies = repliesByParentId[comment.id] || [];
                  const isCommentOwner = currentUser?.id === comment.userId;
                  const isProductOwner = currentUser?.id === product.ownerId;
                  const userInitials = comment.username
                    ? comment.username.slice(0, 2).toUpperCase()
                    : "??";

                  return (
                    <div key={comment.id}>
                      <div
                        className="d-flex gap-3 p-3 rounded-3"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        {/* avatar */}
                        <div className="flex-shrink-0">
                          {comment.userProfileImageUrl ? (
                            <img
                              src={comment.userProfileImageUrl}
                              alt={comment.username}
                              className="rounded-circle"
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="rounded-circle align-items-center justify-content-center fw-bold text-white bg-secondary"
                            style={{
                              width: "48px",
                              height: "48px",
                              fontSize: "0.9rem",
                              display: comment.userProfileImageUrl ? "none" : "flex",
                            }}
                          >
                            {userInitials}
                          </div>
                        </div>

                        {/* Commentarios contenido */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <span className="fw-bold">{comment.username}</span>
                              {isProductOwner && comment.userId === product.ownerId && (
                                <span
                                  className="badge bg-primary ms-2"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  Vendedor
                                </span>
                              )}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="text-muted small"
                                title={formatFullDate(comment.createdAt)}
                              >
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-link p-0 text-decoration-none"
                                onClick={() => {
                                  setReplyToComment({ id: comment.id, username: comment.username });
                                  setCommentError("");
                                }}
                                title="Responder"
                              >
                                <i className="bi bi-reply me-1"></i>
                                Responder
                              </button>
                              {isCommentOwner && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link text-danger p-0"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  title="Eliminar comentario"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                            {comment.content}
                          </p>
                        </div>
                      </div>

                      {replies.length > 0 && (
                        <div className="ms-4 ms-md-5 mt-2 d-flex flex-column gap-2">
                          {replies.map((reply) => {
                            const isReplyOwner = currentUser?.id === reply.userId;
                            const replyInitials = reply.username
                              ? reply.username.slice(0, 2).toUpperCase()
                              : "??";

                            return (
                              <div
                                key={reply.id}
                                className="d-flex gap-2 p-3 rounded-3"
                                style={{
                                  backgroundColor: "#eef3ff",
                                  borderLeft: "3px solid #0d6efd",
                                }}
                              >
                                <div className="flex-shrink-0">
                                  {reply.userProfileImageUrl ? (
                                    <img
                                      src={reply.userProfileImageUrl}
                                      alt={reply.username}
                                      className="rounded-circle"
                                      style={{
                                        width: "38px",
                                        height: "38px",
                                        objectFit: "cover",
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="rounded-circle align-items-center justify-content-center fw-bold text-white bg-secondary"
                                    style={{
                                      width: "38px",
                                      height: "38px",
                                      fontSize: "0.75rem",
                                      display: reply.userProfileImageUrl ? "none" : "flex",
                                    }}
                                  >
                                    {replyInitials}
                                  </div>
                                </div>

                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start mb-1">
                                    <div>
                                      <span className="fw-bold small">{reply.username}</span>
                                      {currentUser?.id === product.ownerId && reply.userId === product.ownerId && (
                                        <span
                                          className="badge bg-primary ms-2"
                                          style={{ fontSize: "0.65rem" }}
                                        >
                                          Vendedor
                                        </span>
                                      )}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                      <span
                                        className="text-muted small"
                                        title={formatFullDate(reply.createdAt)}
                                      >
                                        {formatRelativeTime(reply.createdAt)}
                                      </span>
                                      {isReplyOwner && (
                                        <span
                                          className="text-danger"
                                          style={{ cursor: "pointer" }}
                                          title="Eliminar comentario"
                                          onClick={() => handleDeleteComment(reply.id)}
                                        >
                                          <i className="bi bi-trash"></i>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="mb-0 small" style={{ whiteSpace: "pre-wrap" }}>
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Similar Producto*/}
        {!isLoadingSimilar && similarProducts.length > 0 && (
          <div className="card border-0 shadow-sm rounded-4 mt-4">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h5 fw-bold mb-0">
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Productos Similares
                </h2>
                <span className="badge bg-secondary">{similarProducts.length}</span>
              </div>

              <div className="row g-3">
                {similarProducts.map((similar) => {
                  const similarClosed = isAuctionClosed(similar.endAt, similar.closed);
                  const urgent = isAuctionUrgent(similar.endAt, similarClosed);
                  
                  return (
                    <div className="col-md-6 col-lg-4" key={similar.id}>
                      <Link
                        to={`/products/${similar.id}`}
                        className="text-decoration-none"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <div className="card h-100 border-0 shadow-sm rounded-4 hover-shadow transition">
                          {similar.imageUrl && (
                            <img
                              src={similar.imageUrl}
                              alt={similar.title}
                              className="card-img-top"
                              style={{
                                height: "180px",
                                objectFit: "cover",
                                borderRadius: "1rem 1rem 0 0",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                              <h3 className="h6 fw-bold mb-0 text-dark">{similar.title}</h3>
                              <div className="d-flex flex-column align-items-end gap-1">
                                <span
                                  className={`badge ${
                                    similarClosed ? "bg-secondary" : "bg-success"
                                  }`}
                                >
                                  {similarClosed ? "Cerrada" : "Abierta"}
                                </span>
                                {urgent && <span className="badge bg-danger">Último día</span>}
                              </div>
                            </div>

                            <p className="text-muted small mb-2" style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}>
                              {similar.description}
                            </p>

                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-bold text-primary">
                                  {Number(similar.currentPrice || 0).toFixed(2)} €
                                </span>
                                <span className="small text-muted">
                                  {similar.bidsCount || 0} pujas
                                </span>
                              </div>

                              <div className="small">
                                <LiveCountdown
                                  endDate={similar.endAt}
                                  isClosed={similarClosed}
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
