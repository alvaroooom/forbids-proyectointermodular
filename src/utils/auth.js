const API_BASE_URL = "http://localhost:8080";
const AUTH_STORAGE_KEY = "forbidsAuth";

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

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("forbidsUser");
}

export async function fetchCurrentUser() {
  const session = getAuthSession();

  if (!session?.token) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Session expired");
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
