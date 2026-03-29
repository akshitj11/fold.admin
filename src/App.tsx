import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { ContractsPage } from "./pages/ContractsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PaymasterPage } from "./pages/PaymasterPage";
import { SharedMemoriesPage } from "./pages/SharedMemoriesPage";
import { UsersPage } from "./pages/UsersPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/paymaster" element={<PaymasterPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/shares" element={<SharedMemoriesPage />} />
        <Route path="/shared-memories" element={<Navigate to="/shares" replace />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Route>
    </Routes>
  );
}
