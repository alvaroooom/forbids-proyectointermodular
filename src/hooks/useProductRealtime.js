import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { apiUrl } from "../utils/api";
import { getAuthSession } from "../utils/auth";

let sharedClient = null;
let sharedClientPromise = null;
let sharedClientToken = null;
const topicSubscribers = new Map();

export function disconnectRealtimeClient() {
  if (sharedClient) {
    sharedClient.deactivate();
    sharedClient = null;
  }
  sharedClientPromise = null;
  sharedClientToken = null;
}

function topicKey(productId, channel) {
  return `${productId}:${channel}`;
}

function ensureSharedClient(token) {
  if (sharedClient?.connected && sharedClientToken === token) {
    return Promise.resolve(sharedClient);
  }

  if (sharedClient || sharedClientPromise) {
    disconnectRealtimeClient();
  }

  sharedClientPromise = new Promise((resolve, reject) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(apiUrl("/ws")),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => {
        sharedClient = client;
        sharedClientToken = token;
        sharedClientPromise = null;

        topicSubscribers.forEach((handlers, key) => {
          const [productId, channel] = key.split(":");
          client.subscribe(`/topic/products/${productId}/${channel}`, (message) => {
            try {
              const payload = JSON.parse(message.body);
              handlers.forEach((handler) => handler(payload));
            } catch {
              // ignore malformed payloads
            }
          });
        });

        resolve(client);
      },
      onStompError: () => {
        sharedClientPromise = null;
        reject(new Error("No se pudo conectar por WebSocket"));
      },
      onWebSocketClose: () => {
        sharedClient = null;
        sharedClientPromise = null;
        sharedClientToken = null;
      },
    });

    client.activate();
  });

  return sharedClientPromise;
}

function subscribeTopic(productId, channel, handler) {
  const key = topicKey(productId, channel);
  const handlers = topicSubscribers.get(key) ?? new Set();
  handlers.add(handler);
  topicSubscribers.set(key, handlers);

  if (sharedClient?.connected) {
    const subscriptionKey = `sub-${key}`;
    if (!sharedClient._forbidsSubscriptions?.has(subscriptionKey)) {
      sharedClient._forbidsSubscriptions = sharedClient._forbidsSubscriptions ?? new Set();
      sharedClient._forbidsSubscriptions.add(subscriptionKey);
      sharedClient.subscribe(`/topic/products/${productId}/${channel}`, (message) => {
        try {
          const payload = JSON.parse(message.body);
          topicSubscribers.get(key)?.forEach((fn) => fn(payload));
        } catch {
          // ignore malformed payloads
        }
      });
    }
  }

  return () => {
    const current = topicSubscribers.get(key);
    if (!current) {
      return;
    }

    current.delete(handler);
    if (current.size === 0) {
      topicSubscribers.delete(key);
    }
  };
}

export function useProductRealtime({
  productIds = [],
  onBid,
  onChat,
  enabled = true,
}) {
  const onBidRef = useRef(onBid);
  const onChatRef = useRef(onChat);

  useEffect(() => {
    onBidRef.current = onBid;
  }, [onBid]);

  useEffect(() => {
    onChatRef.current = onChat;
  }, [onChat]);

  useEffect(() => {
    if (!enabled || productIds.length === 0) {
      return undefined;
    }

    const uniqueIds = [...new Set(productIds.filter(Boolean))];
    const token = getAuthSession()?.token ?? null;
    let cancelled = false;
    const cleanups = [];

    ensureSharedClient(token)
      .then(() => {
        if (cancelled) {
          return;
        }

        uniqueIds.forEach((productId) => {
          if (onBidRef.current) {
            cleanups.push(
              subscribeTopic(productId, "bids", (payload) => {
                onBidRef.current?.(productId, payload);
              })
            );
          }

          if (onChatRef.current) {
            cleanups.push(
              subscribeTopic(productId, "chat", (payload) => {
                onChatRef.current?.(productId, payload);
              })
            );
          }
        });
      })
      .catch(() => {
        // Realtime is optional; HTTP remains the source of truth.
      });

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [enabled, productIds.join(",")]);
}

export function publishChatMessage(productId, content) {
  if (!sharedClient?.connected) {
    throw new Error("Chat no conectado");
  }

  const payload = {
    productId: Number(productId),
    content: content.trim(),
    type: "CHAT",
  };

  sharedClient.publish({
    destination: `/app/chat/${productId}`,
    body: JSON.stringify(payload),
  });
}

export async function ensureChatConnection() {
  const token = getAuthSession()?.token;
  if (!token) {
    throw new Error("Inicia sesión para usar el chat");
  }

  return ensureSharedClient(token);
}
