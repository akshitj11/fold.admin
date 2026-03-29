export type ApiResult<T> = {
  data: T | null;
  error: string | null;
  networkError: boolean;
};

export type Metrics = {
  totalUsers: number;
  totalMemories: number;
  paymasterBalanceMatic: number;
  gasSpentTodayMatic: number;
  activeSubscriptions: number;
  errorRatePercent: number;
  totalUserOperations: number;
};

export type ChartPoint = {
  date: string;
  users: number;
  memories: number;
  gasSpent: number;
};

export type AdminUser = {
  email: string;
  walletAddress: string;
  memoryCount: number;
  storageUsedMb: number;
  sbtMinted: boolean;
  joinedAt: string;
};

export type ShareItem = {
  ownerEmail: string;
  recipientEmail: string;
  memoryId: string;
  sharedAt: string;
  status: "active" | "revoked" | string;
};
