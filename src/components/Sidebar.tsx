import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Blocks,
  FileBarChart,
  LogOut,
  Shield,
  Building2
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ["ADMIN", "TREASURER", "AUDITOR", "MEMBER"] },

  // hanya ADMIN & TREASURER yang bisa input transaksi
  { icon: PlusCircle, label: "Input Transaksi", path: "/add-transaction", roles: ["ADMIN", "TREASURER"] },

  // riwayat transaksi boleh untuk semua role
  { icon: History, label: "Riwayat Transaksi", path: "/transaction-history", roles: ["ADMIN", "TREASURER", "AUDITOR", "MEMBER"] },

  // blockchain ledger bisa diakses semua, termasuk auditor
  { icon: Blocks, label: "Blockchain Ledger", path: "/blockchain-ledger", roles: ["ADMIN", "TREASURER", "AUDITOR", "MEMBER"] },

  // laporan AI hanya ADMIN & AUDITOR
  { icon: FileBarChart, label: "Laporan AI", path: "/ai-reports", roles: ["ADMIN", "AUDITOR"] },
  // Create Divisi — hanya ADMIN yang bisa membuat divisi
  { icon: PlusCircle, label: "Create Divisi", path: "/create-divisi", roles: ["ADMIN"] },
];

const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem("role") || ""; // role dari login

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
  <Link to="/dashboard" className="flex items-center gap-3">

      <img
        src="/logo-auchan.png"
        alt="AuChan Logo"
        className="w-8 h-8 object-contain"
      />
    <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
      AuChan
    </span>
  </Link>
</div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems
          .filter((item) => item.roles.includes(role)) // ⬅ filter by role
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-card"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
