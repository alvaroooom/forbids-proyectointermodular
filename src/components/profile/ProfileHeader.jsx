import { Link } from "react-router-dom";

export default function ProfileHeader({ currentUser, avatarInitials, activeProductsCount, favoritesCount }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div className="d-flex align-items-center gap-3">
        {currentUser?.profileImageUrl ? (
          <img
            src={currentUser.profileImageUrl}
            alt={currentUser.username}
            className="rounded-circle shadow-sm"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "4px solid #fff",
              boxShadow: "0 0 0 2px #0d6efd",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="rounded-circle bg-primary text-white fw-bold shadow-sm"
          style={{
            width: "100px",
            height: "100px",
            fontSize: "32px",
            display: currentUser?.profileImageUrl ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #fff",
            boxShadow: "0 0 0 2px #0d6efd",
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
              {activeProductsCount} productos
            </span>
            <span className="badge bg-light text-dark border">
              <i className="bi bi-heart-fill text-danger me-1"></i>
              {favoritesCount} favoritos
            </span>
          </div>
        </div>
      </div>
      <Link to="/products/new" className="btn btn-primary">
        <i className="bi bi-plus-lg me-1"></i>
        Publicar producto
      </Link>
    </div>
  );
}
