type Listener = (isConnected: boolean) => void;

let connected = true;
const listeners = new Set<Listener>();

export function setConnectionStatus(isConnected: boolean) {
  connected = isConnected;
  listeners.forEach((listener) => listener(isConnected));
}

export function getConnectionStatus() {
  return connected;
}

export function subscribeConnection(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
