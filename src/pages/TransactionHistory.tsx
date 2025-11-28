import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";

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
  // other possible fields from backend...
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

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { divisionId, projectId } = useParams();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");

  // helper to safely read category/project/division names from many possible shapes
  const readCategoryName = (t: RawTransaction) =>
    t.category?.categoryName || t.category?.name || "—";
  const readProjectName = (t: RawTransaction) =>
    t.project?.projectName || t.project?.name || "—";
  const readDivisionName = (t: RawTransaction) =>
    t.project?.division?.divisionName || t.project?.division?.name || "—";

  // fetch and normalize
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
        const params = new URLSearchParams({
          page: "1",
          limit: "50",
        });

        if (divisionId) params.append("divisionId", divisionId);
        if (projectId) params.append("projectId", projectId);

        const url = `https://backend-auchan-production.up.railway.app/api/transactions?${params.toString()}`;
        console.log("REQUEST:", url);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rawText = await res.text();
        console.log("RAW RESPONSE:", rawText);

        if (!res.ok) {
          // try parse JSON message if exists
          try {
            const parsed = JSON.parse(rawText);
            setError(parsed?.message || JSON.stringify(parsed) || "Fetch failed");
          } catch {
            setError(`Fetch failed: ${res.status} ${res.statusText}`);
          }
          setTransactions([]);
          setLoading(false);
          return;
        }

        const json = JSON.parse(rawText);

        // API returns data wrapped: { success: true, data: { meta:..., data: [...] } }
        // but sometimes it may return { success: true, data: [...] } — handle both.
        const rawList: RawTransaction[] =
          Array.isArray(json?.data?.data) ? json.data.data : Array.isArray(json?.data) ? json.data : [];

        // normalize to frontend Transaction[]
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
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Kesalahan jaringan atau parsing response.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [divisionId, projectId, token]);

  // safe search & filter (removed category filter)
  const q = search.trim().toLowerCase();
  const filtered = transactions.filter((trx) => {
    const matchesSearch =
      !q ||
      trx.description.toLowerCase().includes(q) ||
      trx.project.toLowerCase().includes(q) ||
      trx.division.toLowerCase().includes(q);

    return matchesSearch;
  });

  // pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

          {loading ? (
            <div className="text-center py-12">Loading transactions...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-600">{error}</div>
          ) : (
            <>
              {/* Table */}
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
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-6 text-muted-foreground">
                          Tidak ada transaksi ditemukan
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((trx, index) => (
                        <tr key={trx.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="py-3 px-4">{trx.description}</td>
                          <td className="py-3 px-4">{trx.project}</td>
                          <td className="py-3 px-4">{trx.category}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={trx.type.toLowerCase() === "income" ? "default" : "destructive"}
                              className="rounded-lg"
                            >
                              {trx.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            Rp {Number(trx.amount).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {trx.date ? new Date(trx.date).toLocaleString() : "-"}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // maintain same route structure as you had
                                // if divisionId/projectId exist, keep them; otherwise navigate without
                                const base = divisionId && projectId
                                  ? `/divisions/${divisionId}/projects/${projectId}/transactions/${trx.id}`
                                  : `/transactions/${trx.id}`;
                                navigate(base);
                              }}
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

              {/* Pagination Controls */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} transaksi
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
