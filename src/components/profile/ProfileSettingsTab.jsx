import { useEffect, useState } from "react";
import {
  DEFAULT_PREFERENCES,
  getPreferences,
  savePreferences,
} from "../../utils/userPreferences";

export default function ProfileSettingsTab({ currentUser }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (currentUser?.id) {
      setPreferences(getPreferences(currentUser.id));
    }
  }, [currentUser?.id]);

  const updatePreference = (key, value) => {
    const next = savePreferences(currentUser.id, { [key]: value });
    setPreferences(next);
    setSavedMessage("Preferencias guardadas");
    window.setTimeout(() => setSavedMessage(""), 2500);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="h5 fw-bold mb-4">Preferencias</h2>

            {savedMessage && (
              <div className="alert alert-success py-2 small">{savedMessage}</div>
            )}

            <div className="mb-4">
              <label className="form-label fw-600">Tema de la interfaz</label>
              <select
                className="form-select"
                value={preferences.theme}
                onChange={(event) => updatePreference("theme", event.target.value)}
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="showProfilePublicly"
                checked={preferences.showProfilePublicly}
                onChange={(event) =>
                  updatePreference("showProfilePublicly", event.target.checked)
                }
              />
              <label className="form-check-label" htmlFor="showProfilePublicly">
                Mostrar mi nombre de usuario en pujas y comentarios
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
