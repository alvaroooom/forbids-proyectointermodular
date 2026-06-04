import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { applyTheme, getPreferences, savePreferences } from "../utils/userPreferences";

export default function ThemeToggle({ className = "" }) {
  const { currentUser } = useAuth();
  const [darkMode, setDarkMode] = useState(
    () => getPreferences(currentUser?.id).theme === "dark"
  );

  useEffect(() => {
    const syncTheme = () => {
      const prefs = getPreferences(currentUser?.id);
      const isDark = prefs.theme === "dark";
      setDarkMode(isDark);
      applyTheme(prefs.theme);
    };

    syncTheme();
    window.addEventListener("forbids-preferences-changed", syncTheme);
    return () => window.removeEventListener("forbids-preferences-changed", syncTheme);
  }, [currentUser?.id]);

  const toggleDarkMode = () => {
    const nextDarkMode = !darkMode;
    const theme = nextDarkMode ? "dark" : "light";
    setDarkMode(nextDarkMode);
    applyTheme(theme);

    if (currentUser?.id) {
      savePreferences(currentUser.id, { theme });
    } else {
      savePreferences(null, { theme });
    }
  };

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`btn btn-sm btn-outline-secondary border-0 ${className}`.trim()}
      title={darkMode ? "Modo claro" : "Modo oscuro"}
      aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
    >
      <i className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"}`}></i>
    </button>
  );
}
