import { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function AdminUsersPanel({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await api.get("/api/admin/users", { auth: true });
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error.message || "No se pudieron cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBan = async (user) => {
    if (!confirm(`${user.banned ? "¿Desbanear" : "¿Banear"} a ${user.username}?`)) {
      return;
    }

    try {
      await api.patch(`/api/admin/users/${user.id}/ban`, { banned: !user.banned }, { auth: true });
      await loadUsers();
    } catch (error) {
      alert(error.message || "No se pudo actualizar el usuario");
    }
  };

  const toggleRole = async (user) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`¿Cambiar rol de ${user.username} a ${nextRole === "ADMIN" ? "Administrador" : "Usuario"}?`)) {
      return;
    }

    try {
      await api.patch(`/api/admin/users/${user.id}/role`, { role: nextRole }, { auth: true });
      await loadUsers();
    } catch (error) {
      alert(error.message || "No se pudo cambiar el rol");
    }
  };

  if (isLoading) {
    return <p className="text-muted">Cargando usuarios...</p>;
  }

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge ${user.role === "ADMIN" ? "bg-dark" : "bg-secondary"}`}>
                  {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                </span>
              </td>
              <td>
                {user.banned ? (
                  <span className="badge bg-danger">Baneado</span>
                ) : (
                  <span className="badge bg-success">Activo</span>
                )}
              </td>
              <td className="d-flex gap-2">
                {user.id !== currentUser?.id && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => toggleBan(user)}
                    >
                      {user.banned ? "Desbanear" : "Banear"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleRole(user)}
                    >
                      {user.role === "ADMIN" ? "Quitar administrador" : "Hacer administrador"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
