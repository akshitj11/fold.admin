import { getConnectionStatus, setConnectionStatus } from "./connection";
import type { ApiResult } from "../types/admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ADMIN_WALLET = import.meta.env.VITE_ADMIN_WALLET_ADDRESS || "";

async function request<T>(path: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        "x-admin-wallet": ADMIN_WALLET,
      },
    });

    if (!response.ok) {
      return {
        data: null,
        error: `Request failed with status ${response.status}`,
        networkError: false,
      };
    }

    const json = await response.json();
    if (!getConnectionStatus()) setConnectionStatus(true);

    return {
      data: (json?.data ?? json) as T,
      error: null,
      networkError: false,
    };
  } catch {
    setConnectionStatus(false);
    return {
      data: null,
      error: "Unable to reach API server",
      networkError: true,
    };
  }
}

export const api = {
  metrics: () => request<Record<string, unknown>>("/api/admin/metrics"),
  growth: () => request<unknown>("/api/admin/metrics/growth"),
  gasHistory: () => request<unknown>("/api/admin/metrics/gas-history"),
  users: () => request<unknown>("/api/admin/users"),
  shares: () => request<unknown>("/api/admin/shares"),
};
