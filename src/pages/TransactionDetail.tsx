import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Paperclip, AlertTriangle } from "lucide-react";

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
  aiAnomalyScore: number | null; // Field lama di root (bisa diabaikan jika pakai anomalyReport)
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
  // Sesuaikan dengan JSON baru
  anomalyReport: {
    id: string;
    transactionId: string;
    aiScore: number;
    reason: string;
    status: string;
    auditorId: string | null;
    auditorNotes: string | null;
    createdAt: string;
    updatedAt: string | null;
  } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [id, token]);

  return (
    <div className="flex min-h-screen bg-background">
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
          </div>
        )}

        {/* DATA */}
        {!loading && trx && (
          <div className="space-y-8">
            
            {/* SECTION: INFO UTAMA */}
            <Card className="shadow-sm border-primary/20">
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
                  <p>
                    <strong>Tanggal:</strong>{" "}
                    {new Date(trx.transactionDate).toLocaleString("id-ID")}
                  </p>
                  <div className="mt-4">
                    <strong>Status Transaksi:</strong>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {trx.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p><strong>User:</strong> {trx.user.name}</p>
                  <p><strong>Email:</strong> {trx.user.email}</p>
                  
                  <div className="mt-4">
                    <strong>Description</strong>
                    <div className="bg-muted p-3 rounded-md mt-1 italic text-sm">
                      "{trx.description || "Tidak ada deskripsi"}"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

             {/* SECTION: PROJECT */}
             <Card className="shadow-sm">
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

            {/* --- SECTION BARU: ANOMALY REPORT --- */}
            {trx.anomalyReport && (
              <Card className="shadow-sm border-destructive/50 bg-destructive/5">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <CardTitle className="text-destructive text-lg">
                    AI Anomaly Detection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score & Status Row */}
                  <div className="flex flex-wrap items-center gap-4">
                     <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Anomaly Score:</span>
                        <Badge 
                          variant={trx.anomalyReport.aiScore > 0.5 ? "destructive" : "secondary"}
                          className="text-sm px-3"
                        >
                          {(trx.anomalyReport.aiScore * 100).toFixed(1)}%
                        </Badge>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Audit Status:</span>
                        <Badge variant="outline" className="capitalize bg-background">
                          {trx.anomalyReport.status}
                        </Badge>
                     </div>
                  </div>

                  {/* Reason Box */}
                  <div className="bg-background border border-destructive/20 p-4 rounded-md">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      Alasan Deteksi AI:
                    </p>
                    <p className="text-foreground font-medium">
                      {trx.anomalyReport.reason}
                    </p>
                  </div>

                  {/* Auditor Notes (Jika ada) */}
                  {trx.anomalyReport.auditorNotes && (
                    <div className="bg-background border p-4 rounded-md">
                      <p className="text-sm font-semibold text-muted-foreground mb-1">
                        Catatan Auditor:
                      </p>
                      <p>{trx.anomalyReport.auditorNotes}</p>
                    </div>
                  )}
                  
                  {/* Jika belum ada notes */}
                  {!trx.anomalyReport.auditorNotes && (
                     <p className="text-xs text-muted-foreground">
                       * Belum ada catatan review dari auditor internal.
                     </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* SECTION: ATTACHMENTS */}
            <Card className="shadow-sm">
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