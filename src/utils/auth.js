import { apiUrl } from "./api";

const AUTH_STORAGE_KEY = "forbidsAuth";
const sessionListeners = new Set();

export function onSessionExpired(listener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function notifySessionExpired() {
  sessionListeners.forEach((listener) => listener());
}

export function saveAuthSession(authResponse) {
  if (!authResponse?.token) {
    throw new Error("No se recibió token de sesión");
  }

  const session = {
    token: authResponse.token,
    user: {
      id: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      profileImageUrl: authResponse.profileImageUrl || null,
      role: authResponse.role || "USER",
    },
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.removeItem("forbidsUser");

  return session;
}

export function getAuthSession() {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession);

    if (!session?.token || !session?.user) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function clearAuthSession({ notify = true } = {}) {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("forbidsUser");
  if (notify) {
    notifySessionExpired();
  }
}

export async function fetchCurrentUser() {
  const session = getAuthSession();

  if (!session?.token) {
    throw new Error("No hay sesión activa");
  }

  const response = await fetch(apiUrl("/api/auth/me"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "La sesión ha caducado");
  }

  const nextSession = {
    token: session.token,
    user: {
      id: data.id,
      username: data.username,
      email: data.email,
      profileImageUrl: data.profileImageUrl || null,
      role: data.role || "USER",
    },
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
  return nextSession.user;
}
