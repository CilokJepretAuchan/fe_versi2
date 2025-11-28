import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, 
  Loader2, 
  FileDown, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  Clock,
  CalendarDays
} from "lucide-react";
import { toast } from "sonner";

// --- Types ---
type JobStatus = "idle" | "processing" | "completed" | "failed";

interface JobResponse {
  job_id: string;
  status: JobStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
}

const AIReports = () => {
  // State Form Input
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selectedYear, setSelectedYear] = useState("2025");
  
  // State Active Job
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>("idle");
  
  // State Metadata (Menyimpan info bulan/tahun dari Job yang sedang AKTIF/Tersimpan)
  const [activeJobMeta, setActiveJobMeta] = useState<{month: string, year: string} | null>(null);

  // Loading States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const orgId = localStorage.getItem("orgId");
  const BASE_URL = "https://petanihandal-auchanagenticservices.hf.space";

  // --- 1. Load State on Mount ---
  useEffect(() => {
    const savedJobId = localStorage.getItem("active_report_job_id");
    const savedMeta = localStorage.getItem("active_report_meta");
    
    if (savedJobId) {
      setJobId(savedJobId);
      // Coba cek status terakhir jika ada
      checkJobStatus(savedJobId);
    }

    if (savedMeta) {
      setActiveJobMeta(JSON.parse(savedMeta));
    }
  }, []);

  // --- 2. Generate Report (Overwrite logic) ---
  const generateReport = async () => {
    if (!orgId) {
      toast.error("Organization ID tidak ditemukan");
      return;
    }

    setIsGenerating(true);
    try {
      const url = `${BASE_URL}/api/build-report`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id: orgId,
          month: parseInt(selectedMonth),
          year: parseInt(selectedYear),
        }),
      });

      console.log(orgId, selectedMonth, selectedYear);
      // --- LOGIC 404 (Tidak Ada Transaksi) ---
      if (res.status === 404) {
        toast.error(`Tidak ada transaksi ditemukan pada ${getMonthName(selectedMonth)} ${selectedYear}. Laporan tidak dapat dibuat.`);
        // Jangan ubah state Job ID, biarkan report sebelumnya (jika ada) tetap tampil
        return;
      }

      if (!res.ok) {
        throw new Error("Gagal memulai job pembuatan laporan");
      }

      const data = await res.json();
      
      // Sukses: Overwrite state Job lama dengan yang baru
      const newJobId = data.job_id;
      const newMeta = { month: selectedMonth, year: selectedYear };

      setJobId(newJobId);
      setJobStatus("processing");
      setActiveJobMeta(newMeta);

      // Simpan ke LocalStorage agar persist saat refresh
      localStorage.setItem("active_report_job_id", newJobId);
      localStorage.setItem("active_report_meta", JSON.stringify(newMeta));
      
      toast.success("Memulai analisis AI baru...");
    } catch (error) {
      console.error("Error starting job:", error);
      toast.error("Terjadi kesalahan sistem saat membuat laporan.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 3. Check Status ---
  const checkJobStatus = async (id: string = jobId!) => {
    if (!id) return;
    
    setIsChecking(true);
    try {
      const url = `${BASE_URL}/api/build-report/status/${id}`;
      const res = await fetch(url);
      
      if (res.status === 404) {
        // Edge case: Job ID ada di local storage tapi hilang di server (misal restart server)
        setJobStatus("failed");
        toast.error("Job ID tidak ditemukan di server.");
        return;
      }

      if (!res.ok) throw new Error("Gagal mengecek status");

      const data: JobResponse = await res.json();
      setJobStatus(data.status);

      if (data.status === "completed") {
        toast.success("Laporan selesai! Siap diunduh.");
      } else if (data.status === "failed") {
        toast.error("Proses pembuatan laporan gagal.");
      } 

    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // --- 4. Download ---
  const downloadReport = async () => {
    if (!jobId) return;

    setIsDownloading(true);
    try {
      const url = `${BASE_URL}/api/extract/download/${jobId}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Gagal mengunduh file");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Gunakan meta bulan/tahun yang tersimpan untuk nama file
      const fileName = `Report_${getMonthName(activeJobMeta?.month || "1")}_${activeJobMeta?.year || "2025"}.pdf`;
      
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast.success("File berhasil diunduh");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Gagal mengunduh file laporan");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper: Get Month Name
  const getMonthName = (m: string) => {
    const index = parseInt(m) - 1;
    return new Date(0, index).toLocaleString('id-ID', { month: 'long' });
  };

  // UI Component: Status Badge
  const StatusBadge = () => {
    switch (jobStatus) {
      case "processing":
        return <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Sedang Diproses</Badge>;
      case "completed":
        return <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Selesai</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Gagal</Badge>;
      default:
        return <Badge variant="outline">Menunggu</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Laporan AI Agent</h1>
          <p className="text-muted-foreground">
            Generate laporan keuangan mendalam menggunakan AI.
          </p>
        </div>

        {/* --- SECTION 1: FORM GENERATOR (Selalu Aktif) --- */}
        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">
              Generator Laporan Baru
            </h3>
          </div>
         
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-foreground mb-2">Bulan Transaksi</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-foreground mb-2">Tahun Transaksi</label>
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

            <Button 
              onClick={generateReport} 
              disabled={isGenerating} 
              className="rounded-xl w-full md:w-auto min-w-[140px]"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
              {/* Ubah teks tombol tergantung apakah sudah ada job atau belum */}
              {jobId ? "Generate Ulang" : "Generate Laporan"}
            </Button>
          </div>
        </div>

        {/* --- SECTION 2: STATUS CARD (Hanya muncul jika ada Job ID di storage) --- */}
        {jobId && activeJobMeta && (
          <div className="bg-gradient-hero rounded-2xl shadow-glow p-1 border border-border animate-in fade-in slide-in-from-bottom-4">
            {/* Inner Card Container */}
            <div className="bg-background/95 backdrop-blur-xl rounded-[14px] p-6">
              
              {/* Header Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${jobStatus === 'processing' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                    {jobStatus === 'processing' ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      Status Pekerjaan
                      <StatusBadge />
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        Laporan Periode: <span className="font-semibold text-foreground">{getMonthName(activeJobMeta.month)} {activeJobMeta.year}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => checkJobStatus()}
                    disabled={isChecking}
                  >
                    <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isChecking ? "animate-spin" : ""}`} />
                    Refresh Status
                  </Button>
                </div>
              </div>

              {/* Body Content */}
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs text-muted-foreground flex justify-between items-center">
                  <span>JOB ID: {jobId}</span>
                  {/* Tampilkan indikator jika form di atas berbeda dengan laporan yang sedang aktif */}
                  {(selectedMonth !== activeJobMeta.month || selectedYear !== activeJobMeta.year) && (
                    <span className="text-yellow-600 flex items-center gap-1">
                      (Form diatas tidak sesuai dengan laporan ini)
                    </span>
                  )}
                </div>

                {jobStatus === "processing" && (
                   <p className="text-sm text-muted-foreground text-center py-4">
                     AI sedang menganalisis anomali dan merekap transaksi. Mohon tunggu, proses ini memakan waktu sekitar 30-60 detik.
                   </p>
                )}
                
                {jobStatus === "completed" && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                    <h3 className="text-green-700 font-bold text-lg mb-2">Analisis Selesai!</h3>
                    <p className="text-green-600/80 mb-6 text-sm">Laporan PDF Anda telah siap untuk diunduh.</p>
                    
                    <Button 
                      size="lg"
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                      onClick={downloadReport}
                      disabled={isDownloading}
                    >
                      {isDownloading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileDown className="w-5 h-5 mr-2" />}
                      Download Laporan PDF
                    </Button>
                  </div>
                )}

                {jobStatus === "failed" && (
                   <p className="text-destructive text-sm text-center py-4 bg-destructive/5 rounded-lg border border-destructive/20">
                     Gagal memproses laporan. Silakan coba generate ulang melalui form diatas.
                   </p>
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIReports;