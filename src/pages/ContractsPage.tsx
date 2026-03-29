import { useMemo } from "react";

const contracts = [
  { label: "Memory Vault", env: "VITE_MEMORY_VAULT_ADDRESS" },
  { label: "Paymaster", env: "VITE_PAYMASTER_ADDRESS" },
  { label: "Premium SBT", env: "VITE_PREMIUM_SBT_ADDRESS" },
  { label: "Storage NFT", env: "VITE_STORAGE_NFT_ADDRESS" },
] as const;

export function ContractsPage() {
  const network = import.meta.env.VITE_NETWORK || "testnet";
  const networkLabel = network === "mainnet" ? "Polygon Mainnet" : "Polygon Amoy Testnet";

  const rows = useMemo(
    () =>
      contracts.map((contract) => {
        const address = import.meta.env[contract.env] || "";
        return {
          ...contract,
          address,
          link: address ? `https://amoy.polygonscan.com/address/${address}` : "",
        };
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Contracts</h2>

      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Contract</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Address</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Network</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.env}>
                <td className="px-4 py-3">{row.label}</td>
                <td className="px-4 py-3 font-mono text-xs">{row.address || "-"}</td>
                <td className="px-4 py-3">{networkLabel}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                      onClick={() => row.address && navigator.clipboard.writeText(row.address)}
                    >
                      Copy
                    </button>
                    {row.link ? (
                      <a
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700"
                        href={row.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Polygonscan
                      </a>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
