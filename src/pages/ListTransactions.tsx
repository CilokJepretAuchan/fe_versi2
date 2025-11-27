import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  type: string;
  amount: number;
  date: string;
  category: string;
  verified: boolean;
}

const ListTransactions = () => {
  const navigate = useNavigate();
  const { divisionId, projectId } = useParams();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");

  // FETCH TRANSACTION DATA
  const fetchTransactions = async () => {
  if (!token || !orgId) {
    console.error("Token atau orgId tidak ditemukan");
    return;
  }

  try {
    const params = new URLSearchParams({
      orgId: orgId, // PARAM BENAR SESUAI API DOCS
      page: "1",
      limit: "20",
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

    const raw = await res.text();
    console.log("RAW RESPONSE:", raw);

    if (!res.ok) {
      console.error("Fetch failed:", res.status, raw);
      return;
    }

    const json = JSON.parse(raw);

    setTransactions(json.data || []);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};



  useEffect(() => {
    fetchTransactions();
  }, [divisionId, projectId, orgId]);

  // FILTER LOGIC
  const filteredTransactions = transactions.filter((trx) => {
    const matchSearch =
      trx.title.toLowerCase().includes(search.toLowerCase()) ||
      trx.id.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "all" || trx.category === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Transaksi Project</h1>
          <p className="text-muted-foreground">
            Lihat semua transaksi yang terkait dengan project ini
          </p>
        </div>

        <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border">
          
          {/* Search + Add */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
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

            <Button
              className="rounded-xl px-5"
              onClick={() =>
                navigate(
                  `/divisions/${divisionId}/projects/${projectId}/transactions/create`
                )
              }
            >
              + Tambah Transaksi
            </Button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left">ID</th>
                  <th className="py-3 text-left">Judul</th>
                  <th className="py-3 text-left">Tipe</th>
                  <th className="py-3 text-left">Jumlah</th>
                  <th className="py-3 text-left">Tanggal</th>
                  <th className="py-3 text-left">Status Hash</th>
                  <th className="py-3 text-left">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3">{trx.id}</td>
                    <td className="py-3">{trx.title}</td>

                    <td className="py-3">
                      <Badge
                        variant={
                          trx.type === "pemasukan" ? "default" : "destructive"
                        }
                        className="rounded-lg"
                      >
                        {trx.type}
                      </Badge>
                    </td>

                    <td className="py-3">
                      Rp {trx.amount.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3 text-muted-foreground">{trx.date}</td>

                    <td className="py-3">
                      <Badge
                        variant={trx.verified ? "default" : "secondary"}
                        className="rounded-lg"
                      >
                        {trx.verified ? "Valid" : "Invalid"}
                      </Badge>
                    </td>

                    <td className="py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/divisions/${divisionId}/projects/${projectId}/transactions/${trx.id}`
                          )
                        }
                      >
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
              <p className="text-muted-foreground">
                Tidak ada transaksi ditemukan
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListTransactions;
