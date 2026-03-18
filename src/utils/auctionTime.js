const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function isAuctionClosed(endAt, closed) {
  if (closed) {
    return true;
  }

  if (!endAt) {
    return false;
  }

  const endTimestamp = new Date(endAt).getTime();
  if (Number.isNaN(endTimestamp)) {
    return false;
  }

  return endTimestamp <= Date.now();
}

export function formatAuctionEndDate(endAt) {
  if (!endAt) {
    return "Sin límite";
  }

  const endDate = new Date(endAt);
  if (Number.isNaN(endDate.getTime())) {
    return "No disponible";
  }

  return endDate.toLocaleString();
}

export function formatAuctionRemaining(endAt, closed) {
  if (isAuctionClosed(endAt, closed)) {
    return "Finalizada";
  }

  if (!endAt) {
    return "Sin límite";
  }

  const endTimestamp = new Date(endAt).getTime();
  if (Number.isNaN(endTimestamp)) {
    return "No disponible";
  }

  const diffMs = endTimestamp - Date.now();

  if (diffMs <= 0) {
    return "Expirada";
  }

  const totalMinutes = Math.floor(diffMs / 60000);

  if (totalMinutes < 60) {
    return `${Math.max(totalMinutes, 1)} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours < 24) {
    return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours > 0) {
    return `${days} d ${remainingHours} h`;
  }

  return `${days} d`;
}

export function isAuctionUrgent(endAt, closed) {
  if (isAuctionClosed(endAt, closed) || !endAt) {
    return false;
  }

  const endTimestamp = new Date(endAt).getTime();
  if (Number.isNaN(endTimestamp)) {
    return false;
  }

  const diffMs = endTimestamp - Date.now();

  return diffMs > 0 && diffMs < ONE_DAY_MS;
}
