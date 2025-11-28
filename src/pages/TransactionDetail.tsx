import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Hash, Paperclip } from "lucide-react";

interface TransactionDetail {
  id: string;
  userId: string;
  orgId: string;
  projectId: string;
  categoryId: string;
  amount: string;
  type: string;
  description: string;
  transactionDate: string;
  status: string;
  aiAnomalyScore: number | null;
  blockchainHash: string | null;
  blockchainTxId: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  category: {
    categoryName: string;
  };
  project: {
    projectName: string;
    budgetAllocated: string;
    division: {
      name: string;
    };
  };
  attachments: any[];
}

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [trx, setTrx] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `https://backend-auchan-production.up.railway.app/api/transactions/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (json.success) setTrx(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar tidak ikut loading */}
      <Sidebar />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Transaction Report Detail</h1>
            <p className="text-muted-foreground">
              Analisis lengkap transaksi & status blockchain
            </p>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded-xl" />
            <div className="h-40 bg-muted animate-pulse rounded-xl" />
            <div className="h-40 bg-muted animate-pulse rounded-xl" />
            <div className="h-40 bg-muted animate-pulse rounded-xl" />
          </div>
        )}

        {/* DATA */}
        {!loading && trx && (
          <div className="space-y-8">

            {/* SECTION: INFO UTAMA */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Informasi Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p><strong>ID:</strong> {trx.id}</p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    <span className="font-semibold text-foreground">
                      Rp {Number(trx.amount).toLocaleString("id-ID")}
                    </span>
                  </p>
                  <p><strong>Type:</strong> {trx.type}</p>
                  <p><strong>Status:</strong> {trx.status}</p>
                  <p>
                    <strong>Tanggal:</strong>{" "}
                    {new Date(trx.transactionDate).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">AI Anomaly Score:</p>
                  {trx.aiAnomalyScore === null ? (
                    <Badge variant="outline">N/A</Badge>
                  ) : (
                    <Badge
                      variant={trx.aiAnomalyScore >= 0.7 ? "destructive" : "default"}
                      className="rounded-lg text-sm px-3 py-1"
                    >
                      {(trx.aiAnomalyScore * 100).toFixed(1)}%
                    </Badge>
                  )}

                  <div className="mt-4">
                    <strong>Description</strong>
                    <div className="bg-muted p-3 rounded-md mt-1">
                      {trx.description || "Tidak ada deskripsi"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION: PROJECT */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Project & Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Project:</strong> {trx.project?.projectName}
                </div>
                <div>
                  <strong>Budget:</strong>{" "}
                  Rp {Number(trx.project?.budgetAllocated).toLocaleString("id-ID")}
                </div>
                <div>
                  <strong>Division:</strong> {trx.project?.division?.name}
                </div>
                <div>
                  <strong>Category:</strong> {trx.category?.categoryName}
                </div>
              </CardContent>
            </Card>

            {/* SECTION: BLOCKCHAIN */}
            {/* <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-primary" />
                <CardTitle>Blockchain Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p><strong>Hash:</strong> {trx.blockchainHash || "-"}</p>
                <p><strong>Transaction ID:</strong> {trx.blockchainTxId || "-"}</p>
              </CardContent>
            </Card> */}

            {/* SECTION: ATTACHMENTS */}
            <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-primary" />
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                {trx.attachments?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {trx.attachments.map((att, index) => (
                      <li key={index}>
                        {att.name || att.filename || `File ${index + 1}`}
                        {att.url && (
                          <a
                            className="text-primary ml-2 underline"
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            (Open)
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Tidak ada attachment</p>
                )}
              </CardContent>
            </Card>

          </div>
        )}

        {!loading && !trx && (
          <div className="text-muted-foreground">Transaction not found.</div>
        )}
      </main>
    </div>
  );
}
