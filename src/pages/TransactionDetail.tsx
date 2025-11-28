import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function TransactionDetail() {
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (json.success) {
          setTrx(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!trx) return <div className="p-8">Transaction not found.</div>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-8 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Detail</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div>
              <strong>ID:</strong> {trx.id}
            </div>

            <div>
              <strong>Amount:</strong> Rp {trx.amount}
            </div>

            <div>
              <strong>Type:</strong> {trx.type}
            </div>

            <div>
              <strong>Status:</strong> {trx.status}
            </div>

            <div>
              <strong>Description:</strong> {trx.description}
            </div>

            <div>
              <strong>Transaction Date:</strong>{" "}
              {new Date(trx.transactionDate).toLocaleString()}
            </div>

            <hr />

            <h3 className="font-semibold text-lg">User</h3>
            <div>
              <strong>Name:</strong> {trx.user?.name}
            </div>
            <div>
              <strong>Email:</strong> {trx.user?.email}
            </div>

            <hr />

            <h3 className="font-semibold text-lg">Category</h3>
            <div>
              <strong>Category:</strong> {trx.category?.categoryName}
            </div>

            <hr />

            <h3 className="font-semibold text-lg">Project</h3>
            <div>
              <strong>Project Name:</strong> {trx.project?.projectName}
            </div>
            <div>
              <strong>Budget:</strong> Rp {trx.project?.budgetAllocated}
            </div>
            <div>
              <strong>Division:</strong> {trx.project?.division?.name}
            </div>

            <hr />

            <h3 className="font-semibold text-lg">Blockchain</h3>
            <div>
              <strong>Hash:</strong> {trx.blockchainHash ?? "-"}
            </div>
            <div>
              <strong>TxID:</strong> {trx.blockchainTxId ?? "-"}
            </div>

            <hr />

            <h3 className="font-semibold text-lg">Attachments</h3>
            <div>{trx.attachments.length > 0 ? "Available" : "None"}</div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
