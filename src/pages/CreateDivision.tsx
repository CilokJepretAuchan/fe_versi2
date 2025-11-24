import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CreateDivision = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error("Nama dan kode wajib diisi");
      return;
    }

    setLoading(true);

    try {
      // Attempt to read token from cookie first, fallback to localStorage
      const tokenFromCookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("token="))
        ? document.cookie
            .split("; ")
            .map((s) => s.trim())
            .find((c) => c.startsWith("token="))
            ?.split("=")[1]
        : null;

      const token = tokenFromCookie ? decodeURIComponent(tokenFromCookie) : (JSON.parse(localStorage.getItem("user") || "null")?.token ?? "");

      const res = await fetch("https://backend-auchan-production.up.railway.app/api/divisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, code, description }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.message || "Gagal membuat divisi");
        setLoading(false);
        return;
      }

      toast.success("Divisi berhasil dibuat");
      setLoading(false);
      navigate("/dashboard");
    } catch (e) {
      setLoading(false);
      toast.error("Server error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Divisi</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <Label>Nama Divisi</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Keuangan" />
        </div>

        <div>
          <Label>Kode</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. FIN-001" />
        </div>

        <div>
          <Label>Deskripsi</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi singkat" />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Buat Divisi"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDivision;
