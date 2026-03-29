type MetricCardProps = {
  label: string;
  value: string;
  danger?: boolean;
};

export function MetricCard({ label, value, danger }: MetricCardProps) {
  return (
    <div className={`rounded border p-4 ${danger ? "border-red-300" : "border-slate-200"} bg-white`}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${danger ? "text-red-600" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}
