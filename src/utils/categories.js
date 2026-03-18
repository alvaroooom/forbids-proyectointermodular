// Mapeo de categorías a nombres en español
export const CATEGORY_LABELS = {
  ELECTRONICS: "Electrónica",
  FASHION: "Moda",
  HOME: "Hogar",
  SPORTS: "Deportes",
  BOOKS: "Libros",
  TOYS: "Juguetes",
  AUTOMOTIVE: "Automóviles",
  ART: "Arte",
  MUSIC: "Música",
  OTHER: "Otros"
};

// Mapeo de categorías a colores de Bootstrap
export const CATEGORY_COLORS = {
  ELECTRONICS: "primary",       // Azul
  FASHION: "danger",            // Rojo
  HOME: "warning",              // Amarillo
  SPORTS: "success",            // Verde
  BOOKS: "info",                // Cian
  TOYS: "secondary",            // Gris
  AUTOMOTIVE: "dark",           // Negro
  ART: "light",                 // Blanco (con texto oscuro)
  MUSIC: "primary",             // Azul
  OTHER: "secondary"            // Gris
};

// Obtener el label de una categoría
export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category || "Sin categoría";
}

// Obtener el color de una categoría
export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || "secondary";
}

// Obtener la clase CSS completa para un badge de categoría
export function getCategoryBadgeClass(category) {
  const color = getCategoryColor(category);
  const textClass = color === "light" ? "text-dark" : "";
  return `badge bg-${color} ${textClass}`.trim();
}
