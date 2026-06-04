export default function ProfileStatisticsTab({
  statistics,
  isLoading,
  error,
}) {
  if (isLoading) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted mt-3 mb-0">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 fw-bold mb-0">Mis Estadísticas</h2>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h3 className="h6 fw-bold mb-3 d-flex align-items-center">
            <i className="bi bi-hammer text-primary me-2"></i>
            Actividad en Subastas
          </h3>
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-primary">{statistics.totalBids}</div>
                <div className="small text-muted mt-2">Pujas Realizadas</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-success">{statistics.wonAuctions}</div>
                <div className="small text-muted mt-2">Subastas Ganadas</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-info">{statistics.successRate.toFixed(1)}%</div>
                <div className="small text-muted mt-2">Tasa de Éxito</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-warning">{statistics.totalSpent.toFixed(2)}€</div>
                <div className="small text-muted mt-2">Total Gastado</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h3 className="h6 fw-bold mb-3 d-flex align-items-center">
            <i className="bi bi-shop text-success me-2"></i>
            Actividad como Vendedor
          </h3>
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-primary">{statistics.activeProducts}</div>
                <div className="small text-muted mt-2">Productos Activos</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-secondary">{statistics.closedProducts}</div>
                <div className="small text-muted mt-2">Productos Cerrados</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-info">{statistics.receivedBids}</div>
                <div className="small text-muted mt-2">Pujas Recibidas</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
                <div className="display-6 fw-bold text-danger">{statistics.totalFavorites}</div>
                <div className="small text-muted mt-2">Favoritos Totales</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
