export function calculateTimeRemaining(endDate) {
  if (!endDate) {
    return { expired: true, text: "Sin fecha" };
  }

  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) {
    return { expired: true, text: "Finalizada" };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const totalHours = diff / (1000 * 60 * 60);
  let urgencyLevel = 'normal';
  if (totalHours <= 1) {
    urgencyLevel = 'critical'; // Última hora
  } else if (totalHours <= 24) {
    urgencyLevel = 'high'; // Último día
  } else if (totalHours <= 72) {
    urgencyLevel = 'medium'; // Últimos 3 días
  }

  let text = '';
  if (days > 0) {
    text = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    text = `${minutes}m ${seconds}s`;
  } else {
    text = `${seconds}s`;
  }

  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds,
    text,
    urgencyLevel,
    totalSeconds: Math.floor(diff / 1000),
  };
}

export function getUrgencyClass(urgencyLevel) {
  switch (urgencyLevel) {
    case 'critical':
      return 'text-danger fw-bold';
    case 'high':
      return 'text-warning fw-bold';
    case 'medium':
      return 'text-info';
    default:
      return 'text-muted';
  }
}

export function getUrgencyIcon(urgencyLevel) {
  switch (urgencyLevel) {
    case 'critical':
      return 'bi-exclamation-triangle-fill';
    case 'high':
      return 'bi-clock-fill';
    case 'medium':
      return 'bi-clock';
    default:
      return 'bi-clock';
  }
}
