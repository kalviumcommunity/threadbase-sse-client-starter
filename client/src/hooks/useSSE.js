import { useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;

    const controller = new AbortController();

    fetchEventSource(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      signal: controller.signal,

      onmessage(event) {
        try {
          onMessage(JSON.parse(event.data));
        } catch {
          console.error("[useSSE] Could not parse message:", event.data);
        }
      },

      onerror(error) {
        console.error("[useSSE] SSE connection error:", error);
        // The library retries the connection.
      },
    }).catch((error) => {
      if (error.name !== "AbortError") {
        console.error("[useSSE] Connection failed:", error);
      }
    });

    return () => controller.abort();
  }, [url, user, token, onMessage]);
}
