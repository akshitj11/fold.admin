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
        <Route path="/" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/paymaster" element={<PaymasterPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/shared-memories" element={<SharedMemoriesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
