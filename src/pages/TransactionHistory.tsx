import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye } from "lucide-react";

const TransactionHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const transactions = [
    { id: "TRX001", title: "Pembelian Laptop", type: "pengeluaran", amount: 15000000, date: "2025-01-20", category: "operasional", verified: true },
    { id: "TRX002", title: "Penjualan Produk", type: "pemasukan", amount: 8500000, date: "2025-01-19", category: "penjualan", verified: true },
    { id: "TRX003", title: "Gaji Karyawan", type: "pengeluaran", amount: 25000000, date: "2025-01-18", category: "gaji", verified: true },
    { id: "TRX004", title: "Investasi Modal", type: "pemasukan", amount: 50000000, date: "2025-01-17", category: "investasi", verified: true },
    { id: "TRX005", title: "Sewa Kantor", type: "pengeluaran", amount: 12000000, date: "2025-01-16", category: "operasional", verified: true },
    { id: "TRX006", title: "Maintenance Server", type: "pengeluaran", amount: 3500000, date: "2025-01-15", category: "operasional", verified: true },
    { id: "TRX007", title: "Penjualan Lisensi", type: "pemasukan", amount: 20000000, date: "2025-01-14", category: "penjualan", verified: true },
    { id: "TRX008", title: "Bonus Karyawan", type: "pengeluaran", amount: 5000000, date: "2025-01-13", category: "gaji", verified: false },
  ];

  const filteredTransactions = transactions.filter((trx) => {
    const matchesSearch = trx.title.toLowerCase().includes(search.toLowerCase()) || trx.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || trx.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Riwayat Transaksi</h1>
          <p className="text-muted-foreground">Lihat dan kelola semua transaksi</p>
        </div>

        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-xl">
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="operasional">Operasional</SelectItem>
                <SelectItem value="investasi">Investasi</SelectItem>
                <SelectItem value="gaji">Gaji</SelectItem>
                <SelectItem value="penjualan">Penjualan</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Judul</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipe</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tanggal</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status Hash</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((trx) => (
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
                    <td className="py-3 px-4">
                      <Badge
                        variant={trx.verified ? "default" : "secondary"}
                        className="rounded-lg"
                      >
                        {trx.verified ? "Valid" : "Invalid"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada transaksi ditemukan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
