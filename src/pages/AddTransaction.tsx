import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Hash } from "lucide-react";

const AddTransaction = () => {
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [hash, setHash] = useState("");

  const generateHash = () => {
    // Simple dummy hash generation
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    return `${timestamp}${randomStr}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !title || !amount || !category) {
      toast.error("Mohon isi semua field yang wajib");
      return;
    }

    const generatedHash = generateHash();
    setHash(generatedHash);

    toast.success("Transaksi berhasil disimpan!");
    
    // Reset form
    setTimeout(() => {
      setType("");
      setTitle("");
      setDescription("");
      setAmount("");
      setCategory("");
      setHash("");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Input Transaksi</h1>
            <p className="text-muted-foreground">Tambahkan transaksi baru ke sistem</p>
          </div>

          <div className="bg-gradient-card rounded-2xl shadow-card p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Transaksi *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pemasukan">Pemasukan</SelectItem>
                    <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Judul Transaksi *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Contoh: Pembelian Laptop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi transaksi (opsional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operasional">Operasional</SelectItem>
                    <SelectItem value="investasi">Investasi</SelectItem>
                    <SelectItem value="gaji">Gaji</SelectItem>
                    <SelectItem value="penjualan">Penjualan</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload Bukti</Label>
                <Input
                  id="file"
                  type="file"
                  className="rounded-xl"
                />
              </div>

              <Button type="submit" className="w-full rounded-xl shadow-glow" size="lg">
                Simpan Transaksi
              </Button>
            </form>

            {hash && (
              <div className="mt-6 p-4 bg-success/10 border border-success rounded-xl">
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-success mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-success mb-1">Hash Transaksi:</p>
                    <p className="text-sm text-foreground font-mono break-all">{hash}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddTransaction;