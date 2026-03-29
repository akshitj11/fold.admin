import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErrorState, LoadingState } from "../components/PageState";
import { MetricCard } from "../components/MetricCard";
import { useInterval } from "../hooks/useInterval";
import { api } from "../lib/api";
import { formatMatic, formatPercent } from "../lib/format";
import { parseGrowth, parseMetrics } from "../lib/parsers";
import type { ChartPoint, Metrics } from "../types/admin";

const initialMetrics: Metrics = {
  totalUsers: 0,
  totalMemories: 0,
  paymasterBalanceMatic: 0,
  gasSpentTodayMatic: 0,
  activeSubscriptions: 0,
  errorRatePercent: 0,
  totalUserOperations: 0,
};

export function OverviewPage() {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [growth, setGrowth] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [metricsResult, growthResult] = await Promise.all([api.metrics(), api.growth()]);

    if (metricsResult.error) {
      setError(metricsResult.error);
      setLoading(false);
      return;
    }

    if (growthResult.error) {
      setError(growthResult.error);
      setLoading(false);
      return;
    }

    setMetrics(parseMetrics(metricsResult.data || {}));
    setGrowth(parseGrowth(growthResult.data));
    setError(null);
    setLoading(false);
  }, []);

  useInterval(fetchData, 30000);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Total Users" value={metrics.totalUsers.toLocaleString()} />
        <MetricCard label="Total Memories Saved" value={metrics.totalMemories.toLocaleString()} />
        <MetricCard
          label="Paymaster Balance (MATIC)"
          value={formatMatic(metrics.paymasterBalanceMatic)}
          danger={metrics.paymasterBalanceMatic < 10}
        />
        <MetricCard label="Gas Spent Today (MATIC)" value={formatMatic(metrics.gasSpentTodayMatic)} />
        <MetricCard label="Active Subscriptions" value={metrics.activeSubscriptions.toLocaleString()} />
        <MetricCard
          label="Error Rate (%)"
          value={formatPercent(metrics.errorRatePercent)}
          danger={metrics.errorRatePercent > 5}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-medium text-slate-700">User Growth (30 days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#0f172a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-medium text-slate-700">Memories per Day (30 days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="memories" stroke="#334155" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
