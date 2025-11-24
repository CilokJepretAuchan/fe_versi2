import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

const AIReports = () => {
  const anomalies = [
    {
      id: 1,
      title: "Pengeluaran Tidak Wajar",
      description: "Terdeteksi pengeluaran Rp 25M di luar pola normal (3x lipat dari rata-rata)",
      severity: "high",
      date: "2025-01-18",
    },
    {
      id: 2,
      title: "Duplikasi Transaksi Potensial",
      description: "Dua transaksi serupa dengan jumlah sama dalam 1 jam",
      severity: "medium",
      date: "2025-01-19",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Laporan AI</h1>
          <p className="text-muted-foreground">
            Analisis dan deteksi anomali dengan AI
          </p>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-hero rounded-2xl shadow-glow p-8 border border-border mb-8 text-primary-foreground">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <Bot className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Summary Keuangan Bulanan</h2>
              <p className="text-white/90">Analisis AI untuk periode Januari 2025</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp className="w-6 h-6 mb-2" />
              <p className="text-sm text-white/80 mb-1">Total Pemasukan</p>
              <p className="text-2xl font-bold">Rp 58.5M</p>
              <p className="text-sm text-white/80 mt-1">+12.5% vs bulan lalu</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <TrendingDown className="w-6 h-6 mb-2" />
              <p className="text-sm text-white/80 mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-bold">Rp 52M</p>
              <p className="text-sm text-white/80 mt-1">+8.2% vs bulan lalu</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CheckCircle className="w-6 h-6 mb-2" />
              <p className="text-sm text-white/80 mb-1">Saldo Akhir</p>
              <p className="text-2xl font-bold">Rp 6.5M</p>
              <p className="text-sm text-white/80 mt-1">Surplus</p>
            </div>
          </div>
        </div>

        {/* Pengeluaran Terbesar */}
        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border mb-8">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Pengeluaran Terbesar
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground">Gaji Karyawan</p>
                <p className="text-sm text-muted-foreground">Kategori: Operasional</p>
              </div>
              <p className="text-lg font-bold text-foreground">Rp 25M</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground">Pembelian Laptop</p>
                <p className="text-sm text-muted-foreground">Kategori: Investasi</p>
              </div>
              <p className="text-lg font-bold text-foreground">Rp 15M</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium text-foreground">Sewa Kantor</p>
                <p className="text-sm text-muted-foreground">Kategori: Operasional</p>
              </div>
              <p className="text-lg font-bold text-foreground">Rp 12M</p>
            </div>
          </div>
        </div>

        {/* Deteksi Anomali */}
        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Deteksi Anomali</h3>
            <Badge variant="destructive" className="rounded-lg">
              {anomalies.length} Alert
            </Badge>
          </div>

          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className="p-4 border-l-4 border-destructive bg-destructive/5 rounded-r-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-foreground">{anomaly.title}</h4>
                      <Badge
                        variant={
                          anomaly.severity === "high" ? "destructive" : "secondary"
                        }
                        className="rounded-lg"
                      >
                        {anomaly.severity === "high" ? "Critical" : "Warning"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {anomaly.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{anomaly.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button size="lg" className="rounded-xl shadow-glow">
            <Bot className="w-5 h-5 mr-2" />
            Generate Laporan AI Lengkap
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AIReports;
