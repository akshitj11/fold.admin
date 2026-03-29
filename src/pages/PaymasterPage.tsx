import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErrorState, LoadingState } from "../components/PageState";
import { MetricCard } from "../components/MetricCard";
import { useInterval } from "../hooks/useInterval";
import { api } from "../lib/api";
import { formatMatic } from "../lib/format";
import { average, parseGasHistory, parseMetrics } from "../lib/parsers";
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

export function PaymasterPage() {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [gasHistory, setGasHistory] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [metricsResult, historyResult] = await Promise.all([api.metrics(), api.gasHistory()]);

    if (metricsResult.error) {
      setError(metricsResult.error);
      setLoading(false);
      return;
    }

    if (historyResult.error) {
      setError(historyResult.error);
      setLoading(false);
      return;
    }

    setMetrics(parseMetrics(metricsResult.data || {}));
    setGasHistory(parseGasHistory(historyResult.data));
    setError(null);
    setLoading(false);
  }, []);

  useInterval(fetchData, 30000);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const avgDailySpend = useMemo(() => average(gasHistory.map((point) => point.gasSpent)), [gasHistory]);
  const daysRemaining = avgDailySpend > 0 ? metrics.paymasterBalanceMatic / avgDailySpend : Number.POSITIVE_INFINITY;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Paymaster</h2>

      {metrics.paymasterBalanceMatic < 3 ? (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          CRITICAL — users cannot save memories
        </div>
      ) : metrics.paymasterBalanceMatic < 10 ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Top up required — transactions will fail
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current Balance (MATIC)"
          value={formatMatic(metrics.paymasterBalanceMatic)}
          danger={metrics.paymasterBalanceMatic < 10}
        />
        <MetricCard label="Gas Spent Today (MATIC)" value={formatMatic(metrics.gasSpentTodayMatic)} />
        <MetricCard label="Total UserOperations" value={metrics.totalUserOperations.toLocaleString()} />
      </div>

      <div className="rounded border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-700">Gas Spent Per Day (14 days)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gasHistory}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="gasSpent" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">Estimated days remaining</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {Number.isFinite(daysRemaining) ? daysRemaining.toFixed(1) : "∞"}
        </p>
      </div>
    </div>
  );
}
