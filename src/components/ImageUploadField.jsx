import { useState } from "react";
import { uploadImage, resolveAssetUrl } from "../utils/upload";

export default function ImageUploadField({
  label,
  value,
  onChange,
  helperText = "Puedes pegar una URL o subir una imagen (máx. 5MB).",
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (error) {
      setErrorMessage(error.message || "No se pudo subir la imagen");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const previewUrl = resolveAssetUrl(value);

  return (
    <div className="mb-3">
      <label className="form-label small fw-600">{label}</label>
      <input
        type="url"
        className="form-control mb-2"
        placeholder="https://..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <input
        type="file"
        className="form-control"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <div className="form-text">{helperText}</div>
      {isUploading && <div className="small text-muted mt-1">Subiendo imagen...</div>}
      {errorMessage && <div className="small text-danger mt-1">{errorMessage}</div>}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Vista previa"
          className="rounded-3 mt-3"
          style={{ maxHeight: "180px", objectFit: "cover" }}
          onError={(event) => {
            event.target.style.display = "none";
          }}
        />
      )}
    </div>
  );
}
