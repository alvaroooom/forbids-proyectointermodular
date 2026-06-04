import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import {
  ensureChatConnection,
  publishChatMessage,
  useProductRealtime,
} from "../../hooks/useProductRealtime";
import { getAuthSession } from "../../utils/auth";

const MAX_CHAT_LENGTH = 1000;

function formatTimestamp(value) {
  if (!value) {
    return "";
  }

  try {
    return new Date(value).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ProductChatSection({ productId, productTitle, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const data = await api.get(`/api/products/${productId}/chat/messages`);
        if (!cancelled) {
          setMessages(
            (Array.isArray(data) ? data : []).map((message) => ({
              id: message.id,
              senderUsername: message.senderUsername,
              content: message.content,
              timestamp: message.createdAt,
              type: "CHAT",
            }))
          );
        }
      } catch {
        if (!cancelled) {
          setMessages([]);
        }
      }
    };

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    if (!currentUser) {
      setConnected(false);
      return;
    }

    let cancelled = false;

    ensureChatConnection()
      .then(() => {
        if (!cancelled) {
          setConnected(true);
          setStatusMessage("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setConnected(false);
          setStatusMessage(error.message || "No se pudo conectar al chat");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser, productId]);

  useProductRealtime({
    productIds: [Number(productId)],
    enabled: Boolean(productId),
    onChat: (_productId, payload) => {
      setMessages((prev) => {
        if (payload.id && prev.some((message) => message.id === payload.id)) {
          return prev;
        }
        return [...prev.slice(-199), payload];
      });
    },
  });

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim() || !currentUser) {
      return;
    }

    if (input.trim().length > MAX_CHAT_LENGTH) {
      setStatusMessage(`El mensaje no puede superar ${MAX_CHAT_LENGTH} caracteres.`);
      return;
    }

    setIsSending(true);
    setStatusMessage("");

    try {
      await ensureChatConnection();
      publishChatMessage(productId, input.trim());
      setInput("");
    } catch (error) {
      setStatusMessage(error.message || "No se pudo enviar el mensaje");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4" id="chat-section">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Chat en vivo</h2>
            <p className="text-muted small mb-0">
              Conversación sobre <strong>{productTitle}</strong>
            </p>
          </div>
          <span className={`badge ${connected ? "bg-success" : "bg-secondary"}`}>
            {connected ? "Conectado" : "Desconectado"}
          </span>
        </div>

        {!currentUser ? (
          <div className="alert alert-light border mb-0">
            <i className="bi bi-chat-dots me-2"></i>
            <Link to="/login" state={{ from: { pathname: `/products/${productId}` } }}>
              Inicia sesión
            </Link>{" "}
            para participar en el chat de esta subasta.
          </div>
        ) : (
          <>
            {statusMessage && (
              <div className="alert alert-warning py-2 small">{statusMessage}</div>
            )}

            <div
              ref={listRef}
              className="border rounded-3 p-3 mb-3"
              style={{
                maxHeight: "320px",
                overflowY: "auto",
                backgroundColor: "var(--input-bg, #f8f9fa)",
              }}
            >
              {messages.length === 0 ? (
                <p className="text-muted small mb-0">
                  Aún no hay mensajes. Pregunta sobre el producto o comenta la subasta.
                </p>
              ) : (
                messages.map((message, index) => (
                  <div key={message.id || `${message.timestamp}-${index}`} className="mb-3">
                    <div className="small text-muted">
                      {message.senderUsername || getAuthSession()?.user?.username || "Usuario"} ·{" "}
                      {formatTimestamp(message.timestamp)}
                    </div>
                    <div>{message.content}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="d-flex gap-2">
              <input
                className="form-control"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe un mensaje..."
                maxLength={MAX_CHAT_LENGTH}
                disabled={!connected || isSending}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!connected || !input.trim() || isSending}
              >
                Enviar
              </button>
            </form>
            <div className="small text-muted mt-2 text-end">
              {input.length}/{MAX_CHAT_LENGTH}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
