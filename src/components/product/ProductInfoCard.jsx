import { Link } from "react-router-dom";
import LiveCountdown from "../LiveCountdown";
import { formatAuctionEndDate } from "../../utils/auctionTime";

export default function ProductInfoCard({
  product,
  isOwner,
  isClosed,
  urgent,
  priceFlash = false,
  bidAmount,
  bidError,
  isSubmittingBid,
  isClosingAuction,
  onBidAmountChange,
  onPlaceBid,
  onCloseAuction,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4 p-md-5">
        {product.imageUrl && (
          <div className="mb-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-100 rounded-3"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
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

        <h1 className="h4 fw-bold mb-2">{product.title}</h1>
        <p className="text-muted mb-4">{product.description}</p>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="small text-muted">Propietario</div>
            <div className="fw-semibold">{product.ownerUsername}</div>
          </div>
          <div className="col-md-3">
            <div className="small text-muted">Precio actual</div>
            <div className={`fw-semibold text-primary ${priceFlash ? "bid-flash-text" : ""}`}>
              {Number(product.currentPrice || 0).toFixed(2)} €
            </div>
          </div>
          <div className="col-md-3">
            <div className="small text-muted">Precio inicial</div>
            <div className="fw-semibold">{Number(product.startingPrice || 0).toFixed(2)} €</div>
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
          <LiveCountdown endDate={product.endAt} isClosed={isClosed} size="md" />
        </div>

        {isClosed && (
          <div className="alert alert-info py-2 mb-4" role="alert">
            {product.winnerUsername
              ? `Ganador: ${product.winnerUsername}`
              : "Subasta cerrada sin pujas"}
          </div>
        )}

        {!isClosed && !isOwner && (
          <form onSubmit={onPlaceBid}>
            <div className="mb-3">
              <label className="form-label small fw-600">Tu puja (€)</label>
              <input
                type="number"
                className="form-control"
                min="0.01"
                step="0.01"
                value={bidAmount}
                onChange={onBidAmountChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmittingBid}>
              {isSubmittingBid ? "Pujando..." : "Pujar"}
            </button>
            {bidError && <div className="text-danger small mt-2">{bidError}</div>}
          </form>
        )}

        {!isClosed && isOwner && (
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onCloseAuction}
            disabled={isClosingAuction}
          >
            {isClosingAuction ? "Cerrando..." : "Cerrar subasta"}
          </button>
        )}
      </div>
    </div>
  );
}
