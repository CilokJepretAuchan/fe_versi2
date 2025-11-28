import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import CardStat from "@/components/CardStat";
import ChartLine from "@/components/ChartLine";
import { TrendingUp, TrendingDown, Receipt, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  description: string;
  type: string;
  amount: string;
  transactionDate: string;
  status: string;
  aiAnomalyScore: number | null;
  category: {
    categoryName: string;
  };
  user: {
    name: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    if (!token) {
      console.error("Token tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
      });

      const url = `https://backend-auchan-production.up.railway.app/api/transactions?${params.toString()}`;

      console.log("REQUEST:", url);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const raw = await res.text();
      console.log("RAW RESPONSE:", raw);

      if (!res.ok) {
        console.error("Fetch failed:", res.status, raw);
        setLoading(false);
        return;
      }

      const json = JSON.parse(raw);
      const trx = json?.data?.data || [];
      setTransactions(trx);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    setUserName(parsedUser.name);

    fetchTransactions();
  }, [navigate]);

  // Calculate stats from transactions
  const totalIncome = transactions
    .filter((trx) => trx.type === "INCOME")
    .reduce((sum, trx) => sum + parseFloat(trx.amount), 0);

  const totalExpense = transactions
    .filter((trx) => trx.type === "EXPENSE")
    .reduce((sum, trx) => sum + parseFloat(trx.amount), 0);

  const totalTransactions = transactions.length;

  const alerts = transactions.filter((trx) => trx.aiAnomalyScore !== null).length;

  // Prepare chart data from transactions
  const chartData = transactions.reduce((acc, trx) => {
    const date = new Date(trx.transactionDate);
    const month = date.toLocaleDateString("id-ID", { month: "short" });
    const existing = acc.find(item => item.month === month);
    const amount = parseFloat(trx.amount);

    if (existing) {
      if (trx.type === "INCOME") {
        existing.pemasukan += amount;
      } else {
        existing.pengeluaran += amount;
      }
    } else {
      acc.push({
        month,
        pemasukan: trx.type === "INCOME" ? amount : 0,
        pengeluaran: trx.type === "EXPENSE" ? amount : 0,
      });
    }
    return acc;
  }, [] as { month: string; pemasukan: number; pengeluaran: number }[]).slice(0, 6);

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  // Format transactions for display
  const displayTransactions = paginatedTransactions.map((trx) => ({
    id: trx.id,
    title: trx.description,
    type: trx.type === "INCOME" ? "pemasukan" : "pengeluaran",
    amount: parseFloat(trx.amount),
    date: new Date(trx.transactionDate).toLocaleDateString("id-ID"),
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
            value={`Rp ${totalIncome.toLocaleString("id-ID")}`}
            icon={TrendingUp}
            trend="+12.5%"
            trendUp={true}
          />
          <CardStat
            title="Total Pengeluaran"
            value={`Rp ${totalExpense.toLocaleString("id-ID")}`}
            icon={TrendingDown}
            trend="-8.2%"
            trendUp={false}
          />
          <CardStat
            title="Total Transaksi"
            value={totalTransactions.toString()}
            icon={Receipt}
          />
          <CardStat
            title="Alert AI"
            value={alerts.toString()}
            icon={AlertCircle}
          />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <ChartLine data={chartData} />
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
                {displayTransactions.map((trx) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="rounded-lg"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
