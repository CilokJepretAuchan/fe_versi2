import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Member {
  id: string;
  userId: string;
  roleId: number;
  user: {
    name: string;
    email: string;
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
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);

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
      if (!orgId) {
        toast.error("Organization ID tidak ditemukan");
        return;
      }

      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Gagal mengambil data member");
        return;
      }

      setMembers(data.data || []);
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page]);

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
          body: JSON.stringify({ email: newEmail, roleId: parseInt(newRoleId) }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Gagal menambahkan member");
        return;
      }

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
    setEditRole(member.roleId.toString());
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editRole) return toast.error("Role wajib dipilih");
    if (!selectedMember) return;

    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/members/${selectedMember.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ roleId: parseInt(editRole) }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Gagal mengupdate member");
        return;
      }

      toast.success("Member berhasil diupdate");
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
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/members/${selectedMember.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        toast.error("Gagal menghapus member");
        return;
      }

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
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Daftar Member Organisasi</h2>
          <Button onClick={() => setShowCreateModal(true)}>+ Tambah Member</Button>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Cari member..."
          className="mb-4 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members
              .filter((m) =>
                m.user.name.toLowerCase().includes(search.toLowerCase()) ||
                m.user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((m) => (
                <Card key={m.id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{m.user.name}</span>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => openEdit(m)}
                        >
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
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{m.user.email}</p>
                    <p className="text-xs text-gray-500">
                      Role: <span className="font-medium">{getRoleName(m.roleId)}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex gap-4 justify-center mt-6">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        </div>

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
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Member: {selectedMember?.user.name} ({selectedMember?.user.email})
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
              <DialogTitle>Hapus Member?</DialogTitle>
            </DialogHeader>

            <p>
              Yakin ingin menghapus member{" "}
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
