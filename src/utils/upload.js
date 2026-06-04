import { getAuthSession } from "./auth";
import { apiUrl, ApiError } from "./api";

export function resolveAssetUrl(url) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return apiUrl(url.startsWith("/") ? url : `/${url}`);
}

export async function uploadImage(file) {
  const session = getAuthSession();
  if (!session?.token) {
    throw new ApiError("No hay sesión activa", 401);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(apiUrl("/api/uploads/image"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || "Error al subir la imagen", response.status);
  }

  return resolveAssetUrl(data.url);
}
