import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Do not open a stream when the user is logged out.
    if (!user) return;

    const source = new EventSource(url, {
      withCredentials: true,
    });

    source.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (error) {
        console.error("[useSSE] parse error:", event.data);
      }
    };

    source.onerror = (error) => {
      console.error("[useSSE] error:", error);
    };

    // Close the stream when the effect is cleaned up.
    return () => source.close();
  }, [url, user, onMessage]);
}
