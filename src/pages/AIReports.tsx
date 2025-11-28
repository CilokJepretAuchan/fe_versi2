import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AIReports = () => {
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [reportData, setReportData] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const orgId = localStorage.getItem("orgId");

  const generateReport = async () => {
    if (!orgId) {
      toast.error("Organization ID tidak ditemukan");
      return;
    }

    if (!selectedMonth || !selectedYear) {
      toast.error("Pilih bulan dan tahun terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        org_id: orgId,
        month: selectedMonth,
        year: selectedYear,
      });

      const url = `https://petanihandal-auchanagenticservices.hf.space/api/build_report`;

      console.log("REQUEST:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          org_id: orgId,
          month: parseInt(selectedMonth),
          year: parseInt(selectedYear),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      setReportData(data);
      setAnomalies(data.anomalies || []);
      toast.success("Laporan berhasil dihasilkan");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Gagal menghasilkan laporan");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Report Generator */}
        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">
            Generate Laporan AI
          </h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Bulan
              </label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Januari</SelectItem>
                  <SelectItem value="2">Februari</SelectItem>
                  <SelectItem value="3">Maret</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">Mei</SelectItem>
                  <SelectItem value="6">Juni</SelectItem>
                  <SelectItem value="7">Juli</SelectItem>
                  <SelectItem value="8">Agustus</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tahun
              </label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReport} disabled={loading} className="rounded-xl">
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Bot className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
        </div>

        {/* AI Summary */}
        {reportData && (
          <div className="bg-gradient-hero rounded-2xl shadow-glow p-8 border border-border mb-8 text-primary-foreground">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Bot className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Summary Keuangan Bulanan</h2>
                <p className="text-white/90">Analisis AI untuk periode {selectedMonth}/{selectedYear}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <TrendingUp className="w-6 h-6 mb-2" />
                <p className="text-sm text-white/80 mb-1">Total Pemasukan</p>
                <p className="text-2xl font-bold">Rp {reportData.total_income?.toLocaleString() || "0"}</p>
                <p className="text-sm text-white/80 mt-1">{reportData.income_change || "+0%"} vs bulan lalu</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <TrendingDown className="w-6 h-6 mb-2" />
                <p className="text-sm text-white/80 mb-1">Total Pengeluaran</p>
                <p className="text-2xl font-bold">Rp {reportData.total_expenses?.toLocaleString() || "0"}</p>
                <p className="text-sm text-white/80 mt-1">{reportData.expenses_change || "+0%"} vs bulan lalu</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle className="w-6 h-6 mb-2" />
                <p className="text-sm text-white/80 mb-1">Saldo Akhir</p>
                <p className="text-2xl font-bold">Rp {reportData.net_balance?.toLocaleString() || "0"}</p>
                <p className="text-sm text-white/80 mt-1">{reportData.balance_status || "Neutral"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pengeluaran Terbesar */}
        {reportData?.top_expenses && reportData.top_expenses.length > 0 && (
          <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border mb-8">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Pengeluaran Terbesar
            </h3>
            <div className="space-y-4">
              {reportData.top_expenses.map((expense: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">Kategori: {expense.category}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">Rp {expense.amount?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deteksi Anomali */}
        {anomalies.length > 0 && (
          <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Deteksi Anomali</h3>
              <Badge variant="destructive" className="rounded-lg">
                {anomalies.length} Alert
              </Badge>
            </div>

            <div className="space-y-4">
              {anomalies.map((anomaly: any, index: number) => (
                <div
                  key={anomaly.id || index}
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
        )}

        {/* Generate Button */}
        <div className="text-center">
          <Button size="lg" className="rounded-xl shadow-glow" onClick={generateReport} disabled={loading}>
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Bot className="w-5 h-5 mr-2" />
            )}
            Generate Laporan AI Lengkap
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AIReports;
