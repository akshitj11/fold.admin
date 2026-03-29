import { useCallback, useEffect, useState } from "react";
import { ErrorState, LoadingState } from "../components/PageState";
import { useInterval } from "../hooks/useInterval";
import { api } from "../lib/api";
import { formatDate, truncateId } from "../lib/format";
import { parseShares } from "../lib/parsers";
import type { ShareItem } from "../types/admin";

export function SharedMemoriesPage() {
  const [shares, setShares] = useState<ShareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const result = await api.shares();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setShares(parseShares(result.data));
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
      <h2 className="text-2xl font-semibold text-slate-900">Shared Memories</h2>

      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Owner Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Recipient Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Memory ID</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Shared At</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shares.map((item) => (
              <tr key={`${item.memoryId}-${item.recipientEmail}`}>
                <td className="px-4 py-3">{item.ownerEmail}</td>
                <td className="px-4 py-3">{item.recipientEmail}</td>
                <td className="px-4 py-3">{truncateId(item.memoryId)}</td>
                <td className="px-4 py-3">{formatDate(item.sharedAt)}</td>
                <td className="px-4 py-3 capitalize">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
