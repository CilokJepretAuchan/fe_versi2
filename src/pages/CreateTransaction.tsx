import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

const CreateTransaction = () => {
  const navigate = useNavigate();
  const { projectId, divisionId } = useParams();

  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const userId = localStorage.getItem("userId");

  const [mode, setMode] = useState<"MANUAL" | "AUTO">("MANUAL");

  const [form, setForm] = useState({
    amount: "",
    type: "",
    categoryId: "",
    description: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Always generate transactionDate NOW
  const transactionDate = new Date().toISOString();

  // ===================================
  // MANUAL MODE (Railway Backend)
  // ===================================
  const submitManual = async () => {
    setLoading(true);

    const fd = new FormData();
    fd.append("orgId", orgId!);
    fd.append("projectId", projectId!);
    fd.append("transactionDate", transactionDate);

    fd.append("amount", form.amount);
    fd.append("type", form.type);

    if (form.categoryId) fd.append("categoryId", form.categoryId);
    if (form.description) fd.append("description", form.description);
    if (file) fd.append("attachments", file); // attachment sesuai backend

    const res = await fetch(
      "https://backend-auchan-production.up.railway.app/api/transactions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // FIX #1
        },
        body: fd,
      }
    );

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      navigate(`/divisions/${divisionId}/projects/${projectId}/tasks`);
    } else {
      alert(data.message || "Gagal membuat transaksi.");
    }
  };

  // ===================================
  // AUTO MODE (Extractor)
  // ===================================
  const submitAuto = async () => {
    if (!file) {
      alert("Upload dokumen terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const extractUrl =
        `https://petanihandal-auchanagenticservices.hf.space/api/extract/docx` +
        `?userId=${userId}&orgId=${orgId}&projectId=${projectId}`;

      const response = await fetch(extractUrl, {
        method: "POST",
        body: fd,
      });

      const result = await response.json();
      console.log("EXTRACTOR RESULT:", result);

      // Jika ada error FastAPI internal
      if (result.detail) {
        alert("Dokumen tidak dapat diproses oleh AI.");
        setLoading(false);
        return;
      }

      // Extractor async, tidak langsung return transaksi.
      // Karena transaksi SUDAH disimpan backend-mu → langsung redirect.
      navigate(`/divisions/${divisionId}/projects/${projectId}/tasks`);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Kesalahan saat memproses dokumen.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="p-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Tambah Transaksi</h1>

        {/* MODE SWITCH */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={mode === "MANUAL" ? "default" : "outline"}
            className="flex-1 rounded-xl"
            onClick={() => setMode("MANUAL")}
          >
            Input Manual
          </Button>

          <Button
            variant={mode === "AUTO" ? "default" : "outline"}
            className="flex-1 rounded-xl"
            onClick={() => setMode("AUTO")}
          >
            Upload Dokumen (AI)
          </Button>
        </div>

        <div className="bg-gradient-card border p-6 rounded-2xl space-y-6">

          {/* MANUAL MODE */}
          {mode === "MANUAL" && (
            <div className="space-y-4">
              <Input
                placeholder="Jumlah"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="rounded-xl"
              />

              <Select onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">INCOME</SelectItem>
                  <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih Kategori (Opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1f6c2682-c2d2-4cfd-a71e-859d87513cf3">raw materials</SelectItem>
                  <SelectItem value="3bfc9e0b-dd37-4114-8c8d-444d03b0b8ec">supplies</SelectItem>
                  <SelectItem value="7582c0ac-ea96-4ef2-b80d-abe38bb3898a">food</SelectItem>
                  <SelectItem value="7efcf861-51d0-450d-8a6a-f4d4885d74b3">utilities</SelectItem>

                  {/* <SelectItem value="CAT-IT">Equipment IT</SelectItem>
                  <SelectItem value="CAT-MAKAN">Konsumsi</SelectItem>
                  <SelectItem value="CAT-TRAVEL">Perjalanan Dinas</SelectItem> */}
                </SelectContent>
              </Select>


              <Input
                placeholder="Deskripsi (Opsional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
          )}

          {/* AUTO MODE */}
          {mode === "AUTO" && (
            <p className="text-sm font-medium">
              Upload dokumen PDF/DOCX — AI akan memproses otomatis.
            </p>
          )}

          {/* FILE */}
          <div>
            <p className="font-medium mb-2">Upload File</p>
            <Input
              type="file"
              onChange={(e) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
              className="rounded-xl"
            />
          </div>

          {/* SUBMIT */}
          <Button
            disabled={loading}
            onClick={mode === "MANUAL" ? submitManual : submitAuto}
            className="w-full rounded-xl"
          >
            {loading ? "Memproses..." : "Simpan Transaksi"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateTransaction;
