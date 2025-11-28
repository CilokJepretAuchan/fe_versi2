import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Activity, 
  AlertTriangle, 
  Loader2,
  BarChart3
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { toast } from "sonner";

// --- Types ---
interface StatisticsData {
  totalAmountIncome: number;
  totalAmountExpense: number;
  totalAnomaly: number;
  totalTransaction: number;
}

interface TransactionData {
  id: string;
  description: string;
  amount: number;
  type: string;
  transactionDate: string;
}

const Dashboard = () => {
  // State Statistik Global
  const [stats, setStats] = useState<StatisticsData>({
    totalAmountIncome: 0,
    totalAmountExpense: 0,
    totalAnomaly: 0,
    totalTransaction: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // State Grafik & Transaksi Terbaru
  const [limit, setLimit] = useState("10"); 
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Helper Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const token = localStorage.getItem("token");

  // 1. Fetch Statistik Global
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const url = "https://backend-auchan-production.up.railway.app/api/transactions/statistics";
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && json.data) setStats(json.data);
      } catch (error) {
        console.error("Error stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  // 2. Fetch Data Transaksi
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setDataLoading(true);
      try {
        const params = new URLSearchParams({ page: "1", limit: limit });
        const url = `https://backend-auchan-production.up.railway.app/api/transactions?${params.toString()}`;
        
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        
        const rawList = json?.data?.data || [];
        setTransactions(rawList);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reversedData = [...rawList].reverse().map((t: any) => ({
            name: new Date(t.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            amount: t.amount,
            type: t.type,
            desc: t.description,
            value: t.amount, 
        }));
        
        setChartData(reversedData);

      } catch (error) {
        console.error("Error data:", error);
        toast.error("Gagal memuat data grafik");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [token, limit]);

  const netBalance = stats.totalAmountIncome - stats.totalAmountExpense;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-xl z-50">
          <p className="font-bold text-foreground mb-1">{label}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.desc}</p>
          <p className={`font-bold ${data.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
            {data.type === 'INCOME' ? '+' : '-'} {formatRupiah(data.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    // CONTAINER UTAMA: h-screen & overflow-hidden (Kunci agar tidak scroll window)
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />

      {/* MAIN CONTENT: flex-col & h-full agar mengisi sisa tinggi */}
      <main className="flex-1 flex flex-col h-full p-4 md:p-6 overflow-hidden">
        
        {/* HEADER: flex-none (Tinggi tetap sesuai konten) */}
        <div className="mb-6 flex-none">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Ringkasan performa keuangan Anda.
          </p>
        </div>

        {/* CONTENT WRAPPER: flex-1 min-h-0 (Mengisi sisa ruang vertikal) */}
        <div className="flex-1 flex flex-col min-h-0 gap-6">
            
            {/* 1. STATS GRID: flex-none (Tinggi tetap) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
                {/* Card Income */}
                <div className="bg-gradient-card rounded-2xl p-5 border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <TrendingUp className="w-20 h-20 text-green-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Pemasukan</span>
                    </div>
                    {statsLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 
                        <h3 className="text-xl md:text-2xl font-bold truncate" title={formatRupiah(stats.totalAmountIncome)}>
                            {formatRupiah(stats.totalAmountIncome)}
                        </h3>}
                </div>

                {/* Card Expense */}
                <div className="bg-gradient-card rounded-2xl p-5 border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <TrendingDown className="w-20 h-20 text-red-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Pengeluaran</span>
                    </div>
                    {statsLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 
                        <h3 className="text-xl md:text-2xl font-bold truncate" title={formatRupiah(stats.totalAmountExpense)}>
                            {formatRupiah(stats.totalAmountExpense)}
                        </h3>}
                </div>

                {/* Card Saldo */}
                <div className="bg-gradient-card rounded-2xl p-5 border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Wallet className="w-20 h-20 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Saldo</span>
                    </div>
                    {statsLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 
                        <h3 className={`text-xl md:text-2xl font-bold truncate ${netBalance < 0 ? 'text-red-500' : 'text-blue-500'}`} title={formatRupiah(netBalance)}>
                            {formatRupiah(netBalance)}
                        </h3>}
                </div>

                {/* Card Activity */}
                <div className="bg-gradient-card rounded-2xl p-5 border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Activity className="w-20 h-20 text-purple-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Aktivitas</span>
                    </div>
                    {statsLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold">{stats.totalTransaction} <span className="text-sm font-normal text-muted-foreground">Trx</span></h3>
                            {stats.totalAnomaly > 0 && (
                                <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-orange-500 font-medium bg-orange-500/10 px-2 py-0.5 rounded-full">
                                    <AlertTriangle className="w-3 h-3" /> {stats.totalAnomaly} Alert
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>

            {/* 2. GRAPH & LIST SECTION: flex-1 min-h-0 (Sisa ruang, dengan scroll internal jika perlu) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Grafik Transaksi */}
                <div className="lg:col-span-2 bg-gradient-card rounded-2xl p-5 border border-border shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-4 flex-none">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-muted-foreground" />
                            <h3 className="font-bold text-foreground text-sm md:text-base">Arus Kas</h3>
                        </div>
                        <Select value={limit} onValueChange={setLimit}>
                            <SelectTrigger className="w-[120px] h-8 text-xs bg-background/50">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 Terakhir</SelectItem>
                                <SelectItem value="20">20 Terakhir</SelectItem>
                                <SelectItem value="50">50 Terakhir</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        {dataLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="name" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        stroke="#666"
                                        dy={10}
                                    />
                                    <YAxis 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        stroke="#666"
                                        tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                        {chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.type === 'INCOME' ? '#22c55e' : '#ef4444'} 
                                                fillOpacity={0.9}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                Belum ada data transaksi
                            </div>
                        )}
                    </div>
                </div>
                
                {/* List Transaksi Terbaru */}
                <div className="bg-gradient-card rounded-2xl p-5 border border-border shadow-sm flex flex-col h-full overflow-hidden">
                    <h3 className="font-bold text-foreground mb-4 flex-none text-sm md:text-base">Terbaru</h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
                        {dataLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin w-6 h-6 text-muted-foreground" /></div>
                        ) : transactions.length > 0 ? (
                            transactions.map((trx) => (
                                <div key={trx.id} className="flex items-center justify-between p-3 bg-muted/20 border border-transparent hover:border-border rounded-xl hover:bg-muted/40 transition-all group">
                                    <div className="min-w-0 pr-3">
                                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{trx.description}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {new Date(trx.transactionDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                                        </p>
                                    </div>
                                    <div className={`text-xs md:text-sm font-bold whitespace-nowrap ${trx.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                                        {trx.type === 'INCOME' ? '+' : '-'} {formatRupiah(trx.amount)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm opacity-60">
                                <Activity className="w-8 h-8 mb-2" />
                                <p>Data kosong</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;