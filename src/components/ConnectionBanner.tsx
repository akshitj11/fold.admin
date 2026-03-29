export function ConnectionBanner() {
  return (
    <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
      Connection error: API unreachable. Retrying automatically.
    </div>
  );
}
