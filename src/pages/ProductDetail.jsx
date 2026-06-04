import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useProductRealtime } from "../hooks/useProductRealtime";
import { isAuctionClosed, isAuctionUrgent } from "../utils/auctionTime";
import Navbar from "../components/Navbar";
import ProductInfoCard from "../components/product/ProductInfoCard";
import ProductBidHistory from "../components/product/ProductBidHistory";
import ProductCommentsSection from "../components/product/ProductCommentsSection";
import ProductChatSection from "../components/product/ProductChatSection";
import SimilarProductsGrid from "../components/product/SimilarProductsGrid";
import "../styles/home.css";
export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [comments, setComments] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [isClosingAuction, setIsClosingAuction] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [replyToComment, setReplyToComment] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [priceFlash, setPriceFlash] = useState(false);
  const seenBidIdsRef = useRef(new Set());

  const applyBidUpdate = useCallback((bid) => {
    const amount = Number(bid.amount);
    if (!Number.isFinite(amount)) {
      return;
    }

    if (bid.id && seenBidIdsRef.current.has(bid.id)) {
      return;
    }
    if (bid.id) {
      seenBidIdsRef.current.add(bid.id);
    }

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            currentPrice: amount,
            bidsCount: (prev.bidsCount || 0) + 1,
          }
        : prev
    );

    setBids((prev) => [bid, ...prev]);
    setPriceFlash(true);
    window.setTimeout(() => setPriceFlash(false), 2500);
  }, []);

  const loadProductAndBids = async () => {
    const [productData, bidsData, commentsData] = await Promise.all([
      api.get(`/api/products/${productId}`),
      api.get(`/api/products/${productId}/bids`),
      api.get(`/api/products/${productId}/comments`),
    ]);

    setProduct(productData);
    setBids(Array.isArray(bidsData) ? bidsData : []);
    setComments(Array.isArray(commentsData) ? commentsData : []);
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadProductAndBids();
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Error cargando detalle");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    setErrorMessage("");
    initialize();
    return () => {
      isMounted = false;
      seenBidIdsRef.current.clear();
    };
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    const loadSimilarProducts = async () => {
      setIsLoadingSimilar(true);
      try {
        const data = await api.get(`/api/products/${productId}/similar?limit=6`);
        setSimilarProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar productos similares:", error);
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    loadSimilarProducts();
  }, [product, productId]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const hash = window.location.hash;
    if (hash !== "#comments-section" && hash !== "#chat-section") {
      return;
    }

    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }, [product]);

  useProductRealtime({
    productIds: [Number(productId)],
    enabled: Boolean(productId),
    onBid: (_productId, bid) => applyBidUpdate(bid),
  });

  const requireAuthForAction = () => {
    if (!currentUser) {
      navigate("/login", {
        state: { from: { pathname: `/products/${productId}` } },
      });
      return false;
    }
    return true;
  };

  const handlePlaceBid = async (event) => {
    event.preventDefault();
    setBidError("");

    if (!requireAuthForAction()) {
      setBidError("Inicia sesión para pujar");
      return;
    }

    const parsedAmount = Number(bidAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setBidError("Introduce una puja válida");
      return;
    }

    setIsSubmittingBid(true);
    try {
      const bid = await api.post(
        `/api/products/${productId}/bids`,
        { amount: parsedAmount },
        { auth: true }
      );
      setBidAmount("");
      applyBidUpdate(bid);
    } catch (error) {
      setBidError(error.message || "Error al pujar");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleCloseAuction = async () => {
    setErrorMessage("");
    if (!requireAuthForAction()) {
      setErrorMessage("Inicia sesión para cerrar la subasta");
      return;
    }

    setIsClosingAuction(true);
    try {
      await api.post(`/api/products/${productId}/close`, undefined, { auth: true });
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

    if (!requireAuthForAction()) {
      setCommentError("Inicia sesión para comentar");
      return;
    }

    if (!newComment.trim()) {
      setCommentError("El comentario no puede estar vacío");
      return;
    }

    setIsSubmittingComment(true);
    try {
      await api.post(
        `/api/products/${productId}/comments`,
        {
          content: newComment.trim(),
          parentCommentId: replyToComment?.id || null,
        },
        { auth: true }
      );
      setNewComment("");
      setReplyToComment(null);
      await loadProductAndBids();
    } catch (error) {
      setCommentError(error.message || "Error al crear comentario");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!requireAuthForAction()) return;
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) return;

    try {
      await api.delete(`/api/products/${productId}/comments/${commentId}`, { auth: true });
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

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="main-content py-4">
        <div className="container" style={{ maxWidth: "920px" }}>
          <ProductInfoCard
            product={product}
            isOwner={isOwner}
            isClosed={isClosed}
            urgent={urgent}
            priceFlash={priceFlash}
            bidAmount={bidAmount}
            bidError={bidError}
            isSubmittingBid={isSubmittingBid}
            isClosingAuction={isClosingAuction}
            onBidAmountChange={(event) => setBidAmount(event.target.value)}
            onPlaceBid={handlePlaceBid}
            onCloseAuction={handleCloseAuction}
          />

          <ProductBidHistory bids={bids} product={product} />

          <ProductChatSection
            productId={productId}
            productTitle={product.title}
            currentUser={currentUser}
          />

          <ProductCommentsSection
            comments={comments}
            currentUser={currentUser}
            product={product}
            newComment={newComment}
            replyToComment={replyToComment}
            commentError={commentError}
            isSubmittingComment={isSubmittingComment}
            onNewCommentChange={(event) => setNewComment(event.target.value)}
            onSubmitComment={handleSubmitComment}
            onReply={(comment) => {
              setReplyToComment({ id: comment.id, username: comment.username });
              setCommentError("");
            }}
            onCancelReply={() => setReplyToComment(null)}
            onDeleteComment={handleDeleteComment}
          />

          <SimilarProductsGrid products={similarProducts} isLoading={isLoadingSimilar} />
        </div>
      </div>
    </>
  );
}
