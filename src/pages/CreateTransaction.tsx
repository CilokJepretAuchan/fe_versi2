import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

// --- Types ---
type JobStatus = "idle" | "processing" | "completed" | "failed";

const CreateTransaction = () => {
  const navigate = useNavigate();
  const { projectId, divisionId } = useParams();

  // Auth Data
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const userId = localStorage.getItem("userId");

  // Base URLs
  const BASE_URL_AI = "https://petanihandal-auchanagenticservices.hf.space";
  const BASE_URL_API = "https://backend-auchan-production.up.railway.app";

  // State Mode & Form
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' | 'auto'

  // State Manual Form
  const [form, setForm] = useState({
    amount: "",
    type: "",
    categoryId: "",
    description: "",
  });
  const [manualFile, setManualFile] = useState<File | null>(null);

  // State AI Job
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>("idle");
  const [loading, setLoading] = useState(false);

  // --- 1. POLLING MECHANISM (Untuk AI Mode) ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (jobStatus === "processing" && jobId) {
      interval = setInterval(() => {
        checkJobStatus();
      }, 2000); // Cek setiap 2 detik
    }

    return () => clearInterval(interval);
  }, [jobStatus, jobId]);

  // --- 2. LOGIC: START JOB (AI UPLOAD) ---
  const startAIProcessing = async () => {
    if (!aiFile) {
      toast.error("Pilih dokumen terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", aiFile);

      // Kirim Context (Org, Project, User) agar AI tau kemana data harus disimpan
      const extractUrl = `${BASE_URL_AI}/api/extract/docx?userId=${userId}&orgId=${orgId}&projectId=${projectId}`;

      const res = await fetch(extractUrl, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Gagal mengupload file ke AI Service");

      const data = await res.json();

      if (data.job_id) {
        setJobId(data.job_id);
        setJobStatus("processing");
        toast.info(
          "AI sedang memproses transaksi dan menyimpan ke database..."
        );
      } else {
        throw new Error("Tidak mendapatkan Job ID");
      }
    } catch (error) {
      console.error("AI Upload error:", error);
      toast.error("Gagal memulai proses AI");
      setJobStatus("failed");
      setLoading(false);
    }
  };

  // --- 3. LOGIC: CHECK STATUS ---
  const checkJobStatus = async () => {
    if (!jobId) return;

    try {
      const url = `${BASE_URL_AI}/api/extract/status/${jobId}`;
      const res = await fetch(url);

      if (!res.ok) return;

      const data = await res.json();

      if (data.status === "completed") {
        setJobStatus("completed");
        setLoading(false);
        toast.success("Transaksi berhasil disimpan otomatis!");

        // Redirect setelah sukses (Delay sedikit agar user lihat centang hijau)
        setTimeout(() => {
          navigate(`/divisions/${divisionId}/projects/${projectId}/tasks`);
        }, 1500);
      } else if (data.status === "failed") {
        setJobStatus("failed");
        setLoading(false);
        toast.error("AI gagal memproses dokumen. Silakan coba manual.");
      }
    } catch (error) {
      console.error("Status check error:", error);
    }
  };

  // --- 4. LOGIC: MANUAL SUBMIT ---
  const submitManual = async () => {
    if (!form.amount || !form.type) {
      toast.error("Jumlah dan Tipe wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("orgId", orgId!);
      fd.append("projectId", projectId!);
      fd.append("transactionDate", new Date().toISOString());
      fd.append("amount", form.amount);
      fd.append("type", form.type);

      if (form.categoryId) fd.append("categoryId", form.categoryId);
      if (form.description) fd.append("description", form.description);
      if (manualFile) fd.append("attachments", manualFile);

      const res = await fetch(`${BASE_URL_API}/api/transactions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Transaksi manual berhasil disimpan");
        navigate(`/divisions/${divisionId}/projects/${projectId}/tasks`);
      } else {
        toast.error(data.message || "Gagal menyimpan transaksi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="p-4 md:p-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Buat Transaksi</h1>
          <p className="text-muted-foreground">
            Pilih metode input transaksi sesuai kebutuhan Anda.
          </p>
        </div>

        {/* Main Container: Centered & Responsive */}
        <div className="max-w-2xl mx-auto bg-gradient-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              if (!loading) setActiveTab(v); // Prevent switch tab saat loading
            }}
            className="w-full"
          >
            {/* Tab Navigation */}
            <div className="border-b border-border bg-muted/20 px-6 pt-4">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="manual" disabled={loading}>
                  Input Manual
                </TabsTrigger>
                <TabsTrigger value="auto" disabled={loading}>
                  <Cpu className="w-4 h-4 mr-2" />
                  AI Scan Otomatis
                </TabsTrigger>
              </TabsList>
            </div>

            {/* --- TAB: MANUAL --- */}
            <TabsContent
              value="manual"
              className="p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="space-y-4">
                <div>
                  <Label>Jumlah (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="Contoh: 150000"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    className="rounded-xl mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipe Transaksi</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v })}
                    >
                      <SelectTrigger className="rounded-xl mt-1.5">
                        <SelectValue placeholder="Pilih Tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">
                          Pemasukan (Income)
                        </SelectItem>
                        <SelectItem value="EXPENSE">
                          Pengeluaran (Expense)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Select
                      value={form.categoryId}
                      onValueChange={(v) => setForm({ ...form, categoryId: v })}
                    >
                      <SelectTrigger className="rounded-xl mt-1.5">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1f6c2682-c2d2-4cfd-a71e-859d87513cf3">
                          Raw Materials
                        </SelectItem>
                        <SelectItem value="3bfc9e0b-dd37-4114-8c8d-444d03b0b8ec">
                          Supplies
                        </SelectItem>
                        <SelectItem value="7582c0ac-ea96-4ef2-b80d-abe38bb3898a">
                          Food
                        </SelectItem>
                        <SelectItem value="7efcf861-51d0-450d-8a6a-f4d4885d74b3">
                          Utilities
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Deskripsi</Label>
                  <Input
                    placeholder="Keterangan transaksi..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="rounded-xl mt-1.5"
                  />
                </div>

                <div>
                  <Label>Bukti Transaksi / Struk (Opsional)</Label>
                  <div className="mt-1.5 border border-dashed border-input bg-muted/10 rounded-xl p-4 text-center cursor-pointer hover:bg-muted/20 transition-colors relative">
                    <Input
                      type="file"
                      onChange={(e) =>
                        e.target.files && setManualFile(e.target.files[0])
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
                      <FileText className="w-8 h-8 mb-2 opacity-50" />
                      {manualFile ? (
                        <span className="text-primary font-medium">
                          {manualFile.name}
                        </span>
                      ) : (
                        "Klik untuk upload file"
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={submitManual}
                  disabled={loading}
                  className="w-full rounded-xl h-11 text-base font-medium mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Simpan Transaksi
                </Button>
              </div>
            </TabsContent>

            {/* --- TAB: AUTO (AI) --- */}
            <TabsContent
              value="auto"
              className="p-6 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  AI Automation
                </h3>

                <p className="text-sm text-muted-foreground px-4">
                  Upload laporan keuangan/docx, AI akan membaca dan{" "}
                  <strong>otomatis menyimpan</strong> data ke database.
                </p>

                <p className="text-sm text-muted-foreground px-4">
                  Semakin banyak dokumen yang diunggah, hasil ekstraksi akan
                  semakin akurat.
                </p>

                <p className="text-xs text-muted-foreground px-6 mt-3 italic">
                  <strong>Disclaimer:</strong> Struktur tabel yang{" "}
                  <u>jelas dan tidak menggunakan merged cells</u> akan
                  menghasilkan akurasi ekstraksi dan analisis yang jauh lebih
                  baik. Hindari tabel yang bercampur atau format yang ambigu
                  untuk hasil optimal.
                </p>
              </div>

              {/* State: Upload Area (Jika belum ada Job) */}
              {jobStatus === "idle" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-primary/20 rounded-2xl p-10 text-center bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer relative group">
                    <Input
                      type="file"
                      onChange={(e) =>
                        e.target.files && setAiFile(e.target.files[0])
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-background rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8 text-primary" />
                      </div>
                      {aiFile ? (
                        <div className="bg-background px-4 py-2 rounded-lg border shadow-sm">
                          <p className="font-bold text-foreground">
                            {aiFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(aiFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">
                            Klik untuk upload dokumen
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Format: PDF, JPG, PNG, DOCX
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={startAIProcessing}
                    disabled={!aiFile || loading}
                    className="w-full rounded-xl h-11 text-base font-medium"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      "Mulai Proses AI"
                    )}
                  </Button>
                </div>
              )}

              {/* State: Processing / Success / Failed */}
              {jobStatus !== "idle" && (
                <div className="bg-muted/30 rounded-2xl p-6 border text-center space-y-4">
                  {/* 1. PROCESSING */}
                  {jobStatus === "processing" && (
                    <>
                      <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          AI Sedang Bekerja...
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Menganalisis dokumen dan menyimpan ke database.
                          <br />
                          Mohon jangan tutup halaman ini.
                        </p>
                      </div>
                    </>
                  )}

                  {/* 2. COMPLETED */}
                  {jobStatus === "completed" && (
                    <>
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-green-600">
                          Berhasil Disimpan!
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Transaksi telah masuk ke database.
                          <br />
                          Mengalihkan ke halaman list...
                        </p>
                      </div>
                    </>
                  )}

                  {/* 3. FAILED */}
                  {jobStatus === "failed" && (
                    <>
                      <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-in zoom-in">
                        <XCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-red-600">
                          Proses Gagal
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI gagal membaca dokumen atau menyimpan data.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setJobStatus("idle");
                            setAiFile(null);
                            setJobId(null);
                          }}
                          className="mt-4 rounded-xl"
                        >
                          Coba Lagi
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default CreateTransaction;
