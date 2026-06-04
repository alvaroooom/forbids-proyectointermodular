import { Link } from "react-router-dom";
import LiveCountdown from "../LiveCountdown";
import { isAuctionClosed, isAuctionUrgent } from "../../utils/auctionTime";

export default function SimilarProductsGrid({ products, isLoading }) {
  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 mt-4">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5 fw-bold mb-0">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            Productos Similares
          </h2>
          <span className="badge bg-secondary">{products.length}</span>
        </div>

        <div className="row g-3">
          {products.map((similar) => {
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
                          <span className={`badge ${similarClosed ? "bg-secondary" : "bg-success"}`}>
                            {similarClosed ? "Cerrada" : "Abierta"}
                          </span>
                          {urgent && <span className="badge bg-danger">Último día</span>}
                        </div>
                      </div>

                      <p
                        className="text-muted small mb-2"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {similar.description}
                      </p>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-primary">
                            {Number(similar.currentPrice || 0).toFixed(2)} €
                          </span>
                          <span className="small text-muted">{similar.bidsCount || 0} pujas</span>
                        </div>

                        <div className="small">
                          <LiveCountdown endDate={similar.endAt} isClosed={similarClosed} size="sm" />
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
  );
}
