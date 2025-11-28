import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Member {
  userId: string;
  orgId: string;
  roleId: number;
  joinedAt?: string;
  user: {
    id?: string;
    name: string;
    email: string;
  };
  role?: {
    id?: number;
    name?: string;
  };
}

const getRoleName = (roleId: number) => {
  switch (roleId) {
    case 1: return "Admin";
    case 2: return "Treasurer";
    case 3: return "Auditor";
    case 4: return "Member";
    default: return "Unknown";
  }
};

const AddMember = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRoleId, setNewRoleId] = useState("");

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const orgId = localStorage.getItem("orgId") || "";
  const token = localStorage.getItem("token") || "";

  const fetchMembers = async () => {
    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) return toast.error(data.message || "Gagal memuat data");

      setMembers(data.data || []);
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ====================================
  // CREATE
  // ====================================
  const handleCreate = async () => {
    if (!newEmail.trim()) return toast.error("Email wajib diisi");
    if (!newRoleId) return toast.error("Role wajib dipilih");

    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: newEmail,
            roleId: Number(newRoleId),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Gagal menambahkan member");

      toast.success("Member berhasil ditambahkan");
      setShowCreateModal(false);
      setNewEmail("");
      setNewRoleId("");
      fetchMembers();
    } catch {
      toast.error("Server error");
    }
  };

  // ====================================
  // EDIT
  // ====================================
  const openEdit = (member: Member) => {
    setSelectedMember(member);
    setEditRole(String(member.roleId));
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!selectedMember) return;
    if (!editRole) return toast.error("Role wajib dipilih");

    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/members/${selectedMember?.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roleId: Number(editRole),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Gagal memperbarui role");

      toast.success("Role member diperbarui");
      setShowEditModal(false);
      fetchMembers();
    } catch {
      toast.error("Server error");
    }
  };

  // ====================================
  // DELETE
  // ====================================
  const handleDelete = async () => {
    if (!selectedMember) return;

    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/members/${selectedMember?.userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) return toast.error("Gagal menghapus member");

      toast.success("Member berhasil dihapus");
      setShowDeleteModal(false);
      fetchMembers();
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Daftar Member Organisasi</h2>
          {/* <Button onClick={() => setShowCreateModal(true)}>+ Tambah Member</Button> */}
        </div>

        <Input
          placeholder="Cari nama atau email..."
          className="mb-4 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <Card className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">Nama</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                members
                  .filter(
                    (m) =>
                      m.user.name.toLowerCase().includes(search.toLowerCase()) ||
                      m.user.email.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((m) => (
                    <tr key={m.userId} className="border-t">
                      <td className="p-3 border">{m.user.name}</td>
                      <td className="p-3 border">{m.user.email}</td>
                      <td className="p-3 border">{getRoleName(m.roleId)}</td>
                      <td className="p-3 border text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="secondary" onClick={() => openEdit(m)}>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setSelectedMember(m);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </Card>

        {/* CREATE MODAL */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Member Baru</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
              />

              <Select value={newRoleId} onValueChange={setNewRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Treasurer</SelectItem>
                  <SelectItem value="3">Auditor</SelectItem>
                  <SelectItem value="4">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Batal
              </Button>
              <Button onClick={handleCreate}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* EDIT MODAL */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role Member</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {selectedMember?.user.name} ({selectedMember?.user.email})
              </p>

              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Treasurer</SelectItem>
                  <SelectItem value="3">Auditor</SelectItem>
                  <SelectItem value="4">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button onClick={handleEdit}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DELETE MODAL */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Member</DialogTitle>
            </DialogHeader>

            <p>
              Yakin ingin menghapus{" "}
              <b>{selectedMember?.user.name}</b> dari organisasi?
            </p>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddMember;
