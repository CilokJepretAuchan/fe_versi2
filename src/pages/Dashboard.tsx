import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import CardStat from "@/components/CardStat";
import ChartLine from "@/components/ChartLine";
import { TrendingUp, TrendingDown, Receipt, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    setUserName(parsedUser.name);
  }, [navigate]);

  const recentTransactions = [
    { id: "TRX001", title: "Pembelian Laptop", type: "pengeluaran", amount: 15000000, date: "2025-01-20" },
    { id: "TRX002", title: "Penjualan Produk", type: "pemasukan", amount: 8500000, date: "2025-01-19" },
    { id: "TRX003", title: "Gaji Karyawan", type: "pengeluaran", amount: 25000000, date: "2025-01-18" },
    { id: "TRX004", title: "Investasi Modal", type: "pemasukan", amount: 50000000, date: "2025-01-17" },
    { id: "TRX005", title: "Sewa Kantor", type: "pengeluaran", amount: 12000000, date: "2025-01-16" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {userName}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CardStat
            title="Total Pemasukan"
            value="Rp 58.5M"
            icon={TrendingUp}
            trend="+12.5%"
            trendUp={true}
          />
          <CardStat
            title="Total Pengeluaran"
            value="Rp 52M"
            icon={TrendingDown}
            trend="-8.2%"
            trendUp={false}
          />
          <CardStat
            title="Total Transaksi"
            value="1,234"
            icon={Receipt}
          />
          <CardStat
            title="Alert AI"
            value="3"
            icon={AlertCircle}
          />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <ChartLine />
        </div>

        {/* Recent Transactions */}
        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground font-medium">{trx.id}</td>
                    <td className="py-3 px-4 text-foreground">{trx.title}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={trx.type === "pemasukan" ? "default" : "destructive"}
                        className="rounded-lg"
                      >
                        {trx.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      Rp {trx.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{trx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
