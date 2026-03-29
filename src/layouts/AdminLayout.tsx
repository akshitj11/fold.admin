import { Outlet } from "react-router-dom";
import { ConnectionBanner } from "../components/ConnectionBanner";
import { Sidebar } from "../components/Sidebar";
import { useConnectionStatus } from "../hooks/useConnectionStatus";

export function AdminLayout() {
  const isConnected = useConnectionStatus();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1">
        {!isConnected && <ConnectionBanner />}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
