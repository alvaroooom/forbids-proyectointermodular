import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ImageUploadField from "../components/ImageUploadField";
import "../styles/home.css";

export default function CreateProduct() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    imageUrl: "",
    durationMinutes: "60",
    category: "OTHER",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await api.post(
        "/api/products",
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          startingPrice: Number(formData.startingPrice),
          imageUrl: formData.imageUrl.trim() || null,
          durationMinutes: Number(formData.durationMinutes),
          category: formData.category,
        },
        { auth: true }
      );

      navigate("/home");
    } catch (error) {
      setErrorMessage(error.message || "Error inesperado al publicar");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="main-content py-4">
      <div className="container" style={{ maxWidth: "720px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/home" className="text-decoration-none text-muted fw-600 small">
            <i className="bi bi-arrow-left me-1"></i> Volver al inicio
          </Link>
          <div className="small text-muted">
            Publicando como <strong>{currentUser?.username}</strong>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="h4 fw-bold mb-3">Publicar producto</h2>
            <p className="text-muted small mb-4">
              Crea una publicación para que otros usuarios puedan pujar.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-600">Título</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Ej: iPhone 13 128GB"
                  value={formData.title}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={120}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-600">Descripción</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Describe el estado del producto, accesorios incluidos, etc."
                  value={formData.description}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={2000}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-600">Categoría</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
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
              </div>

              <div className="mb-4">
                <label className="form-label small fw-600">Precio inicial (€)</label>
                <input
                  type="number"
                  name="startingPrice"
                  className="form-control"
                  placeholder="0.00"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <ImageUploadField
                label="Imagen del producto (opcional)"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                helperText="Si lo dejas vacío, ForBids asignará una imagen aleatoria automáticamente."
              />

              <div className="mb-4">
                <label className="form-label small fw-600">Duración (minutos)</label>
                <input
                  type="number"
                  name="durationMinutes"
                  className="form-control"
                  placeholder="60"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  min="0"
                  max="10080"
                  step="1"
                  required
                />
                <div className="form-text">0 = expira inmediatamente · máximo 10080 (7 días)</div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger small py-2" role="alert">
                  {errorMessage}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Publicando..." : "Publicar producto"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
