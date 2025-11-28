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
import { Badge } from "@/components/ui/badge";

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
  const [limit, setLimit] = useState("10"); // Default 10 data terakhir
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

  // 2. Fetch Data Transaksi (Untuk Grafik & List)
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setDataLoading(true);
      try {
        // Fetch transaksi dengan Limit yang dipilih
        const params = new URLSearchParams({ page: "1", limit: limit });
        const url = `https://backend-auchan-production.up.railway.app/api/transactions?${params.toString()}`;
        
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        
        const rawList = json?.data?.data || [];
        
        // Simpan data mentah untuk List di kanan
        setTransactions(rawList);

        // Transform data untuk Grafik (Reverse biar urut dari kiri ke kanan secara kronologis)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reversedData = [...rawList].reverse().map((t: any) => ({
            name: new Date(t.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            amount: t.amount,
            type: t.type, // INCOME / EXPENSE
            desc: t.description,
            // Field khusus untuk warna bar chart
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
  }, [token, limit]); // Re-fetch jika limit berubah

  const netBalance = stats.totalAmountIncome - stats.totalAmountExpense;

  // Custom Tooltip untuk Grafik
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-xl">
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
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan performa keuangan Anda.
          </p>
        </div>

        {/* --- STATS GRID (Sama seperti sebelumnya) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Income */}
          <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-24 h-24 text-green-500" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Pemasukan</span>
            </div>
            {statsLoading ? <Loader2 className="animate-spin" /> : 
                <h3 className="text-2xl font-bold">{formatRupiah(stats.totalAmountIncome)}</h3>}
          </div>

           {/* Card Expense */}
           <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingDown className="w-24 h-24 text-red-500" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                <TrendingDown className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Pengeluaran</span>
            </div>
            {statsLoading ? <Loader2 className="animate-spin" /> : 
                <h3 className="text-2xl font-bold">{formatRupiah(stats.totalAmountExpense)}</h3>}
          </div>

          {/* Card Saldo */}
          <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="w-24 h-24 text-blue-500" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Saldo</span>
            </div>
            {statsLoading ? <Loader2 className="animate-spin" /> : 
                <h3 className={`text-2xl font-bold ${netBalance < 0 ? 'text-red-500' : 'text-blue-500'}`}>{formatRupiah(netBalance)}</h3>}
          </div>

          {/* Card Activity */}
          <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-24 h-24 text-purple-500" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Aktivitas</span>
            </div>
            {statsLoading ? <Loader2 className="animate-spin" /> : 
              <div>
                <h3 className="text-2xl font-bold">{stats.totalTransaction} <span className="text-sm font-normal">Trx</span></h3>
                {stats.totalAnomaly > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-500 font-medium bg-orange-500/10 px-2 py-1 rounded-full w-fit">
                    <AlertTriangle className="w-3 h-3" /> {stats.totalAnomaly} Anomali
                  </div>
                )}
              </div>
            }
          </div>
        </div>

        {/* --- GRAPH & LIST SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* 1. Grafik Transaksi */}
           <div className="lg:col-span-2 bg-gradient-card rounded-2xl p-6 border border-border shadow-card h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-bold text-foreground">Grafik Arus Kas</h3>
                </div>
                
                {/* SELECTOR LIMIT */}
                <Select value={limit} onValueChange={setLimit}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">Terakhir 5</SelectItem>
                        <SelectItem value="10">Terakhir 10</SelectItem>
                        <SelectItem value="20">Terakhir 20</SelectItem>
                        <SelectItem value="50">Terakhir 50</SelectItem>
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
                        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                                dataKey="name" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                stroke="#888888"
                            />
                            <YAxis 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                stroke="#888888"
                                tickFormatter={(value) => `Rp${(value/1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.type === 'INCOME' ? '#22c55e' : '#ef4444'} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Belum ada data transaksi
                    </div>
                )}
              </div>
           </div>
           
           {/* 2. List Transaksi Terbaru */}
           <div className="bg-gradient-card rounded-2xl p-6 border border-border shadow-card h-[400px] flex flex-col">
              <h3 className="font-bold text-foreground mb-4">Transaksi Terbaru</h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-border">
                  {dataLoading ? (
                     <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
                  ) : transactions.length > 0 ? (
                      transactions.map((trx) => (
                        <div key={trx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                            <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{trx.description}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(trx.transactionDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                </p>
                            </div>
                            <div className={`text-sm font-bold whitespace-nowrap ${trx.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                                {trx.type === 'INCOME' ? '+' : '-'} {formatRupiah(trx.amount)}
                            </div>
                        </div>
                      ))
                  ) : (
                      <p className="text-center text-sm text-muted-foreground py-10">Data kosong</p>
                  )}
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;