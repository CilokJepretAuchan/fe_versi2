import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export default function TransactionDetailAdmin() {
  const { divisionId, projectId, transactionId } = useParams();
  console.log("Transaction ID:", transactionId);
  const navigate = useNavigate();
  const [trx, setTrx] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // Editable fields
  const [type, setType] = useState("EXPENSE");
  const [status, setStatus] = useState("Pending");
  const [description, setDescription] = useState("");

  // ===============================
  // GET DETAIL
  // ===============================
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `https://backend-auchan-production.up.railway.app/api/transactions/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (json.success) {
          setTrx(json.data);
          setType(json.data.type);
          setStatus(json.data.status);
          setDescription(json.data.description);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [transactionId]);

  // ===============================
  // UPDATE TRANSACTION
  // ===============================
  const updateTransaction = async () => {
    if (!trx) return;

    setSaving(true);
    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/transactions/${transactionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // hanya field yang boleh diupdate
            type,
            description,
          }),
        }
      );

      const json = await res.json();
      if (json.success) {
        alert("Updated successfully!");
        navigate(`/divisions/${divisionId}/projects/${projectId}/tasks`);
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating transaction");
    }
    setSaving(false);
  };

  // ===============================
  // DELETE TRANSACTION
  // ===============================
  const deleteTransaction = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this?");
    if (!confirmDelete) return;

    try {
      await fetch(
        `https://backend-auchan-production.up.railway.app/api/transactions/${transactionId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Transaction deleted");
      navigate(`/divisions/${divisionId}/projects/${projectId}/tasks`);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ===============================
  // UI
  // ===============================
  if (loading) return <div className="p-8">Loading...</div>;
  if (!trx) return <div className="p-8">Transaction not found.</div>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-8 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Admin Transaction Detail</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* NON EDITABLE */}
            <div><strong>ID:</strong> {trx.id}</div>

            <div>
              <strong>Amount:</strong> Rp {trx.amount} (read-only)
            </div>

            <div>
              <strong>Category:</strong> {trx.category?.categoryName} (read-only)
            </div>

            <div>
              <strong>Date:</strong>{" "}
              {new Date(trx.transactionDate).toLocaleString()} (read-only)
            </div>

            <hr />

            {/* EDITABLE FIELDS */}
            <h3 className="font-semibold text-lg">Editable Fields (Admin)</h3>

            <div>
              <strong>Type:</strong>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[200px] mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">EXPENSE</SelectItem>
                  <SelectItem value="INCOME">INCOME</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <strong>Status:</strong>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px] mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <strong>Description:</strong>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <hr />

            <div className="flex gap-4">
              <Button disabled={saving} onClick={updateTransaction}>
                {saving ? "Saving..." : "Update"}
              </Button>

              <Button variant="destructive" onClick={deleteTransaction}>
                Delete
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
