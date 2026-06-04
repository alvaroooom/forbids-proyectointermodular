const STORAGE_PREFIX = "forbids.preferences";
const LEGACY_THEME_KEY = "theme";

export const DEFAULT_PREFERENCES = {
  showProfilePublicly: true,
  theme: "light",
};

function storageKey(userId) {
  return userId ? `${STORAGE_PREFIX}.${userId}` : `${STORAGE_PREFIX}.guest`;
}

export function getPreferences(userId = null) {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PREFERENCES };
  }

  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch {
    // ignore invalid JSON
  }

  const legacyTheme = window.localStorage.getItem(LEGACY_THEME_KEY);
  if (legacyTheme === "dark") {
    return { ...DEFAULT_PREFERENCES, theme: "dark" };
  }

  return { ...DEFAULT_PREFERENCES };
}

export function savePreferences(userId, partial) {
  if (typeof window === "undefined") {
    return getPreferences(userId);
  }

  const next = { ...getPreferences(userId), ...partial };
  window.localStorage.setItem(storageKey(userId), JSON.stringify(next));

  if (next.theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    window.localStorage.setItem(LEGACY_THEME_KEY, "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.setItem(LEGACY_THEME_KEY, "light");
  }

  window.dispatchEvent(new CustomEvent("forbids-preferences-changed", { detail: next }));
  return next;
}

export function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
