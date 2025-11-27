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
import { toast } from "sonner";

const ListDivision = () => {
  const navigate = useNavigate();

  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDivisionName, setNewDivisionName] = useState("");

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<any>(null);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const orgId = localStorage.getItem("orgId") || "";
  const token = localStorage.getItem("token") || "";

  const fetchDivisions = async () => {
    try {
      if (!orgId) {
        toast.error("Organization ID tidak ditemukan");
        return;
      }

      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/divisions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Gagal mengambil data divisi");
        return;
      }

      setDivisions(data.data || []);
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, [page]);

  // ====================================
  // CREATE
  // ====================================
  const handleCreate = async () => {
    if (!newDivisionName.trim()) return toast.error("Nama divisi wajib diisi");

    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/divisions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newDivisionName }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Gagal membuat divisi");
        return;
      }

      toast.success("Divisi berhasil ditambahkan");
      setShowCreateModal(false);
      setNewDivisionName("");
      fetchDivisions();
    } catch {
      toast.error("Server error");
    }
  };

  // ====================================
  // EDIT
  // ====================================
  const openEdit = (division: any) => {
    setSelectedDivision(division);
    setEditName(division.name);
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editName.trim()) return toast.error("Nama wajib diisi");

    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/divisions/${selectedDivision.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editName }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Gagal mengedit divisi");
        return;
      }

      toast.success("Divisi berhasil diupdate");
      setShowEditModal(false);
      fetchDivisions();
    } catch {
      toast.error("Server error");
    }
  };

  // ====================================
  // DELETE
  // ====================================
  const handleDelete = async () => {
    if (!selectedDivision) return;

    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/divisions/${selectedDivision.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        toast.error("Gagal menghapus divisi");
        return;
      }

      toast.success("Divisi berhasil dihapus");
      setShowDeleteModal(false);
      fetchDivisions();
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
          <h2 className="text-2xl font-bold">Daftar Divisi</h2>
          <Button onClick={() => setShowCreateModal(true)}>+ Tambah Divisi</Button>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Cari divisi..."
          className="mb-4 max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisions
              .filter((d: any) =>
                d.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((d: any) => (
                <Card
                  key={d.id}
                  className="cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/divisions/${d.id}/projects`)}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{d.name}</span>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(d);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDivision(d);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-xs text-gray-500">
                      Klik card untuk masuk ke list project
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
              <DialogTitle>Tambah Divisi Baru</DialogTitle>
            </DialogHeader>

            <Input
              value={newDivisionName}
              onChange={(e) => setNewDivisionName(e.target.value)}
              placeholder="Nama divisi"
            />

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
              <DialogTitle>Edit Divisi</DialogTitle>
            </DialogHeader>

            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nama divisi"
            />

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
              <DialogTitle>Hapus Divisi?</DialogTitle>
            </DialogHeader>

            <p>
              Yakin ingin menghapus divisi{" "}
              <b>{selectedDivision?.name}</b>?
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

export default ListDivision;
