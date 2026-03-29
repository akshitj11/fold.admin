import { useEffect, useState } from "react";
import { getConnectionStatus, subscribeConnection } from "../lib/connection";

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(getConnectionStatus());

  useEffect(() => {
    const unsubscribe = subscribeConnection(setIsConnected);
    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
}
