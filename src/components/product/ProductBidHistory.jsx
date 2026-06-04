import LiveCountdown from "../LiveCountdown";
import { formatRelativeTime, formatFullDate } from "../../utils/dateFormat";

export default function ProductBidHistory({ bids, product }) {
  const isClosed = Boolean(product?.closed);

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5 fw-bold mb-0">Historial de pujas</h2>
          <span className="badge bg-primary">
            {bids.length} {bids.length === 1 ? "puja" : "pujas"}
          </span>
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
                left: "28px",
                top: "20px",
                bottom: "20px",
                width: "2px",
                backgroundColor: "#e9ecef",
              }}
            ></div>

            <div className="d-flex flex-column gap-3">
              {bids.map((bid, index) => {
                const isHighestBid = index === 0;
                const isWinningBid = isClosed && product.winnerId === bid.bidderId;
                const userInitials = bid.bidderUsername
                  ? bid.bidderUsername.slice(0, 2).toUpperCase()
                  : "??";

                return (
                  <div
                    key={bid.id}
                    className={`d-flex gap-3 position-relative ${isHighestBid ? "bg-light" : ""}`}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      ...(isHighestBid && { border: "2px solid #0d6efd" }),
                    }}
                  >
                    <div className="position-relative flex-shrink-0">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                        style={{
                          width: "56px",
                          height: "56px",
                          backgroundColor: isHighestBid ? "#0d6efd" : "#6c757d",
                          fontSize: "0.9rem",
                          zIndex: 1,
                        }}
                      >
                        {userInitials}
                      </div>
                      {isWinningBid && (
                        <div
                          className="position-absolute bg-success rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "24px",
                            height: "24px",
                            bottom: "-4px",
                            right: "-4px",
                            border: "2px solid white",
                          }}
                        >
                          <i className="bi bi-trophy-fill text-white" style={{ fontSize: "0.7rem" }}></i>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          <span className="fw-bold">{bid.bidderUsername}</span>
                          {isHighestBid && (
                            <span className="badge bg-primary ms-2" style={{ fontSize: "0.7rem" }}>
                              Puja más alta
                            </span>
                          )}
                          {isWinningBid && (
                            <span className="badge bg-success ms-2" style={{ fontSize: "0.7rem" }}>
                              <i className="bi bi-trophy-fill me-1"></i>Ganador
                            </span>
                          )}
                        </div>
                        <span className="fw-bold text-primary" style={{ fontSize: "1.1rem" }}>
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
                              maxWidth: "120px",
                              height: "80px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border: "1px solid #dee2e6",
                            }}
                            onClick={() => window.open(bid.imageUrl, "_blank")}
                            onError={(e) => {
                              e.target.style.display = "none";
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
  );
}
