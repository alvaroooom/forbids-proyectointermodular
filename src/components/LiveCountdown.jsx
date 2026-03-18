import { useEffect, useState } from "react";
import { calculateTimeRemaining, getUrgencyClass, getUrgencyIcon } from "../utils/countdown";

export default function LiveCountdown({ endDate, isClosed, size = 'md', showIcon = true }) {
  const [timeRemaining, setTimeRemaining] = useState(() => 
    calculateTimeRemaining(endDate)
  );

  useEffect(() => {lo 
    if (isClosed) {
      return;
    }

    setTimeRemaining(calculateTimeRemaining(endDate));

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(endDate);
      setTimeRemaining(remaining);

      if (remaining.expired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, isClosed]);

  if (isClosed) {
    return <span className="text-muted small">Subasta cerrada</span>;
  }

  if (timeRemaining.expired) {
    return <span className="text-danger small">Finalizada</span>;
  }

  const sizeClass = size === 'sm' ? 'small' : size === 'lg' ? 'fs-5' : '';
  const urgencyClass = getUrgencyClass(timeRemaining.urgencyLevel);
  const iconClass = getUrgencyIcon(timeRemaining.urgencyLevel);

  const pulseStyle = timeRemaining.urgencyLevel === 'critical' ? {
    animation: 'pulse 1.5s infinite',
  } : {};

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}
      </style>
      <span className={`${sizeClass} ${urgencyClass}`} style={pulseStyle}>
        {showIcon && <i className={`bi ${iconClass} me-1`}></i>}
        {timeRemaining.text}
        {timeRemaining.urgencyLevel === 'critical' && (
          <span className="ms-1 badge bg-danger badge-sm">¡URGENTE!</span>
        )}
      </span>
    </>
  );
}
