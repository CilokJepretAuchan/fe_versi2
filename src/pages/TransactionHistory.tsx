import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Loader2 } from "lucide-react";

// --- Types ---
type RawTransaction = {
  id: string;
  description?: string;
  amount?: string | number;
  type?: string;
  transactionDate?: string;
  category?: { categoryName?: string; name?: string };
  project?: {
    projectName?: string;
    name?: string;
    division?: { divisionName?: string; name?: string };
  };
};

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  category: string;
  project: string;
  division: string;
};

// --- Helper Functions ---
const readCategoryName = (t: RawTransaction) =>
  t.category?.categoryName || t.category?.name || "—";
const readProjectName = (t: RawTransaction) =>
  t.project?.projectName || t.project?.name || "—";
const readDivisionName = (t: RawTransaction) =>
  t.project?.division?.divisionName || t.project?.division?.name || "—";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { divisionId, projectId } = useParams();
  const token = localStorage.getItem("token");

  // --- State ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // --- Effect: Handle Search Debounce ---
  // Mencegah hit API setiap kali user mengetik 1 huruf
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset ke halaman 1 saat search berubah
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // --- Effect: Fetch Data (Server-Side) ---
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        setError("Token tidak ditemukan. Silakan login.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Construct Query Params
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (divisionId) params.append("divisionId", divisionId);
        if (projectId) params.append("projectId", projectId);
        if (debouncedSearch) params.append("search", debouncedSearch); // Kirim search ke backend

        const url = `https://backend-auchan-production.up.railway.app/api/transactions?${params.toString()}`;
        
        // 2. Fetch
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawText = await res.text();
        
        if (!res.ok) {
          throw new Error(`Gagal mengambil data: ${res.statusText}`);
        }

        const json = JSON.parse(rawText);

        // 3. Handle API Response Structure
        // Struktur: { data: { meta: { total: ... }, data: [...] } }
        const rawList: RawTransaction[] = json?.data?.data || [];
        const fetchedTotal = json?.data?.meta?.total || 0;

        // 4. Normalize Data
        const normalized: Transaction[] = rawList.map((t) => ({
          id: t.id,
          description: t.description || "-",
          amount: typeof t.amount === "string" ? Number(t.amount) || 0 : t.amount || 0,
          type: (t.type || "").toUpperCase(),
          date: t.transactionDate || "",
          category: readCategoryName(t),
          project: readProjectName(t),
          division: readDivisionName(t),
        }));

        setTransactions(normalized);
        setTotalItems(fetchedTotal);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Terjadi kesalahan jaringan.");
        setTransactions([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [divisionId, projectId, token, currentPage, itemsPerPage, debouncedSearch]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Helper untuk navigasi detail
  const handleViewDetail = (id: string) => {
    const base = divisionId && projectId
      ? `/divisions/${divisionId}/projects/${projectId}/transactions/${id}`
      : `/transactions/${id}`;
    navigate(base);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Riwayat Transaksi</h1>
          <p className="text-muted-foreground">Lihat dan kelola semua transaksi (Server-side Pagination)</p>
        </div>

        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border">
          {/* --- Search Bar --- */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start">
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari deskripsi / project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl w-full"
              />
            </div>
          </div>

          {/* --- Content Area --- */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Memuat data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">No</th>
                      <th className="text-left py-3 px-4">Deskripsi</th>
                      <th className="text-left py-3 px-4">Project</th>
                      <th className="text-left py-3 px-4">Kategori</th>
                      <th className="text-left py-3 px-4">Tipe</th>
                      <th className="text-left py-3 px-4">Jumlah</th>
                      <th className="text-left py-3 px-4">Tanggal</th>
                      <th className="text-left py-3 px-4">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-8 text-muted-foreground">
                          Tidak ada transaksi ditemukan.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((trx, index) => (
                        <tr key={trx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium">
                             {/* Hitung nomor urut absolut berdasarkan halaman */}
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="py-3 px-4">{trx.description}</td>
                          <td className="py-3 px-4">{trx.project}</td>
                          <td className="py-3 px-4">{trx.category}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={trx.type === "INCOME" ? "default" : "destructive"}
                              className="rounded-lg"
                            >
                              {trx.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            Rp {trx.amount.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {trx.date ? new Date(trx.date).toLocaleString("id-ID") : "-"}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(trx.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* --- Pagination Controls --- */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                    {/* Logic menampilkan text: Showing 1-10 of 500 */}
                    {totalItems > 0 ? (
                        <>
                        Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{" "}
                        <span className="font-medium">{totalItems}</span> data
                        </>
                    ) : (
                        "0 Data"
                    )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    Sebelumnya
                  </Button>
                  
                  {/* Page Indicator Simple */}
                  <div className="flex items-center px-2">
                     <span className="text-sm font-medium">
                        Halaman {currentPage} / {totalPages || 1}
                     </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages || loading}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;