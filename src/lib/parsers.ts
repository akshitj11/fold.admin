import { pickNumber, pickString, toNumber } from "./format";
import type { AdminUser, ChartPoint, Metrics, ShareItem } from "../types/admin";

export function parseMetrics(source: Record<string, unknown>): Metrics {
  return {
    totalUsers: pickNumber(source, ["totalUsers", "users", "userCount"]),
    totalMemories: pickNumber(source, ["totalMemories", "memories", "memoryCount"]),
    paymasterBalanceMatic: pickNumber(source, ["paymasterBalanceMatic", "paymasterBalance", "paymaster_balance"]),
    gasSpentTodayMatic: pickNumber(source, ["gasSpentTodayMatic", "gasSpentToday", "gas_spent_today"]),
    activeSubscriptions: pickNumber(source, ["activeSubscriptions", "subscriptions", "activeSubscriptionsCount"]),
    errorRatePercent: pickNumber(source, ["errorRatePercent", "errorRate", "error_rate_percent"]),
    totalUserOperations: pickNumber(source, ["totalUserOperations", "userOperations", "user_ops_count"]),
  };
}

function normalizeDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ensureArray(input: unknown): unknown[] {
  if (Array.isArray(input)) return input;
  if (typeof input === "object" && input !== null) {
    const obj = input as Record<string, unknown>;
    if (Array.isArray(obj.growth)) return obj.growth;
    if (Array.isArray(obj.history)) return obj.history;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.users)) return obj.users;
    if (Array.isArray(obj.shares)) return obj.shares;
  }
  return [];
}

export function parseGrowth(input: unknown): ChartPoint[] {
  const raw = ensureArray(input);

  return raw.map((item) => {
    const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    const dateValue = pickString(obj, ["date", "day", "createdAt", "timestamp"], "-");
    return {
      date: normalizeDate(dateValue),
      users: pickNumber(obj, ["users", "totalUsers", "userCount"]),
      memories: pickNumber(obj, ["memories", "totalMemories", "memoryCount"]),
      gasSpent: pickNumber(obj, ["gasSpent", "gasSpentMatic", "gas_spent"]),
    };
  });
}

export function parseGasHistory(input: unknown): ChartPoint[] {
  const raw = ensureArray(input);

  return raw.map((item) => {
    const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    return {
      date: normalizeDate(pickString(obj, ["date", "day", "timestamp"], "-")),
      users: 0,
      memories: 0,
      gasSpent: pickNumber(obj, ["gasSpent", "gasSpentMatic", "matic", "value"]),
    };
  });
}

export function parseUsers(input: unknown): AdminUser[] {
  const raw = ensureArray(input);

  return raw.map((item) => {
    const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    return {
      email: pickString(obj, ["email"], "-"),
      walletAddress: pickString(obj, ["walletAddress", "wallet", "address"], ""),
      memoryCount: pickNumber(obj, ["memoryCount", "memories"]),
      storageUsedMb: pickNumber(obj, ["storageUsedMb", "storageUsed", "storage_mb"]),
      sbtMinted: Boolean((obj as Record<string, unknown>).sbt_minted ?? (obj as Record<string, unknown>).sbtMinted),
      joinedAt: pickString(obj, ["joinedAt", "createdAt", "joined_date"], ""),
    };
  });
}

export function parseShares(input: unknown): ShareItem[] {
  const raw = ensureArray(input);

  return raw.map((item) => {
    const obj = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    return {
      ownerEmail: pickString(obj, ["ownerEmail", "owner_email"], "-"),
      recipientEmail: pickString(obj, ["recipientEmail", "recipient_email"], "-"),
      memoryId: pickString(obj, ["memoryId", "memory_id"], "-"),
      sharedAt: pickString(obj, ["sharedAt", "shared_at", "createdAt"], ""),
      status: pickString(obj, ["status"], "active") as ShareItem["status"],
    };
  });
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, value) => sum + toNumber(value), 0);
  return total / values.length;
}
