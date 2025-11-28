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
  const navigate = useNavigate();
  const [trx, setTrx] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role") ?? "MEMBER";

  const canEdit = userRole === "AUDITOR" || userRole === "ADMIN";

  const [type, setType] = useState("EXPENSE");
  const [status, setStatus] = useState("Pending");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `https://backend-auchan-production.up.railway.app/api/transactions/${transactionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  const updateTransaction = async () => {
    if (!canEdit) return alert("You don't have permission.");

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
      alert("Error updating");
    }
    setSaving(false);
  };

  const deleteTransaction = async () => {
    if (!canEdit) return alert("You don't have permission.");

    if (!confirm("Are you sure you want to delete this?")) return;

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

  if (loading) return (
    <div className="flex">
      <Sidebar />
      <div className="p-10 w-full text-center text-lg animate-pulse">Loading transaction details...</div>
    </div>
  );

  if (!trx) return (
    <div className="flex">
      <Sidebar />
      <div className="p-10 w-full text-center text-red-500">Transaction not found.</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="p-8 w-full">
        <Card className="shadow-md border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Admin Transaction Detail</CardTitle>
            <p className="text-sm text-muted-foreground">Review and audit transaction details</p>
          </CardHeader>

          <CardContent className="space-y-8">

            {/* READ-ONLY INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border shadow-sm">
              <div>
                <h3 className="font-semibold text-lg mb-4">General Information</h3>

                <p><strong>ID:</strong> {trx.id}</p>
                <p><strong>Amount:</strong> Rp {Number(trx.amount).toLocaleString("id-ID")}</p>
                <p><strong>Category:</strong> {trx.category?.categoryName}</p>
                <p><strong>Date:</strong> {new Date(trx.transactionDate).toLocaleString()}</p>
                <p><strong>Status:</strong> {trx.status}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Project Information</h3>

                <p><strong>Project:</strong> {trx.project?.projectName}</p>
                <p><strong>Division:</strong> {trx.project?.division?.name}</p>
                <p><strong>Budget Allocated:</strong> Rp {Number(trx.project?.budgetAllocated).toLocaleString("id-ID")}</p>
                <p><strong>Submitted By:</strong> {trx.user?.name} ({trx.user?.email})</p>
              </div>
            </div>

            {/* EDITABLE SECTION */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Editable Fields (Auditor Only)</h3>

              {!canEdit && (
                <p className="text-sm text-red-500 mb-4">
                  You do not have permission to edit this transaction.
                </p>
              )}

              <div className="space-y-4">
                
                <div>
                  <strong>Type</strong>
                  <Select value={type} onValueChange={setType} disabled={!canEdit}>
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
                  <strong>Description</strong>
                  <Input 
                    value={description} 
                    disabled={!canEdit}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            {canEdit && (
                <div className="w-full flex justify-center mt-4">
                    <div className="flex gap-4">
                    <Button disabled={saving} onClick={updateTransaction}>
                        {saving ? "Saving..." : "Update"}
                    </Button>

                    <Button variant="destructive" onClick={deleteTransaction}>
                        Delete
                    </Button>
                    </div>
                </div>
                )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
