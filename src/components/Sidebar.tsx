import { NavLink } from "react-router-dom";

const links = [
  { to: "/overview", label: "Overview" },
  { to: "/users", label: "Users" },
  { to: "/paymaster", label: "Paymaster" },
  { to: "/contracts", label: "Contracts" },
  { to: "/shares", label: "Shares" },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-4 text-slate-200">
      <div className="mb-8 border-b border-slate-800 pb-4">
        <p className="text-sm uppercase tracking-wide text-slate-400">fold admin</p>
        <h1 className="mt-1 text-lg font-semibold">Web3 Monitor</h1>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded px-3 py-2 text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900"}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
