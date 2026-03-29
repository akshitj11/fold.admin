import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState, LoadingState } from "../components/PageState";
import { useInterval } from "../hooks/useInterval";
import { api } from "../lib/api";
import { formatDate, truncateWallet } from "../lib/format";
import { parseUsers } from "../lib/parsers";
import type { AdminUser } from "../types/admin";

export function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState<"all" | "free" | "premium">("all");

  const fetchData = useCallback(async () => {
    const result = await api.users();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setUsers(parseUsers(result.data));
    setError(null);
    setLoading(false);
  }, []);

  useInterval(fetchData, 30000);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const emailMatches = user.email.toLowerCase().includes(search.toLowerCase());
        const planMatches =
          plan === "all" || (plan === "premium" && user.sbtMinted) || (plan === "free" && !user.sbtMinted);

        return emailMatches && planMatches;
      }),
    [users, search, plan],
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Users</h2>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email"
          className="rounded border border-slate-300 px-3 py-2 text-sm md:w-80"
        />
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value as "all" | "free" | "premium")}
          className="rounded border border-slate-300 px-3 py-2 text-sm md:w-48"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Wallet Address</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Memory Count</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Storage Used (MB)</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <tr key={`${user.email}-${user.walletAddress}`}>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{truncateWallet(user.walletAddress)}</td>
                <td className="px-4 py-3">{user.memoryCount.toLocaleString()}</td>
                <td className="px-4 py-3">{user.storageUsedMb.toFixed(2)}</td>
                <td className="px-4 py-3">{user.sbtMinted ? "Premium" : "Free"}</td>
                <td className="px-4 py-3">{formatDate(user.joinedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
