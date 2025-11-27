import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const ProjectsByDivision = () => {
  const { divisionId } = useParams();
  const navigate = useNavigate();

  const orgId = localStorage.getItem("orgId") || "";
  const token = localStorage.getItem("token") || "";

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);       // <= ID untuk edit
  const [deleteTarget, setDeleteTarget] = useState(null); // <= ID untuk delete

  const [form, setForm] = useState({
    projectName: "",
    budgetAllocated: "",
    divisionId: divisionId,
  });

  // Fetch Projects
  const loadProjects = async () => {
    try {
      const url = `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/divisions/${divisionId}/projects?search=${search}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      toast.error("Gagal memuat projek");
    }
  };

  useEffect(() => {
    if (orgId && divisionId) loadProjects();
  }, [search]);

  // Create modal
  const openCreateModal = () => {
    setEditMode(false);
    setEditId(null);
    setForm({
      projectName: "",
      budgetAllocated: "",
      divisionId: divisionId,
    });
    setOpenModal(true);
  };

  // Edit modal
  const openEditModal = (p) => {
    setEditMode(true);
    setEditId(p.id); // <= gunakan editId, bukan deleteTarget
    setForm({
      projectName: p.projectName,
      budgetAllocated: p.budgetAllocated,
      divisionId: divisionId,
    });
    setOpenModal(true);
  };

  // Submit (Create / Edit)
  const handleSubmit = async () => {
    const url = editMode
      ? `https://backend-auchan-production.up.railway.app/api/projects/${editId}`
      : `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/projects/`;

    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: form.projectName,
          budgetAllocated: Number(form.budgetAllocated),
          divisionId: divisionId,
        }),
      });

      if (!res.ok) {
        toast.error("Gagal menyimpan project");
        return;
      }

      toast.success(editMode ? "Project diperbarui" : "Project dibuat");

      setOpenModal(false);
      loadProjects();
    } catch {
      toast.error("Error server");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://backend-auchan-production.up.railway.app/api/organizations/${orgId}/projects/${deleteTarget}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        toast.error("Gagal menghapus project");
        return;
      }

      toast.success("Project dihapus");
      setDeleteTarget(null);
      loadProjects();
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-bold">Projects</h2>

          <Button onClick={openCreateModal}>+ Tambah Project</Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Cari project..."
          className="max-w-sm mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded-xl shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/divisions/${divisionId}/projects/${p.id}/tasks`)}
            >
              <h3 className="font-bold text-lg">{p.projectName}</h3>

              <p className="text-sm text-gray-700">
                Budget: Rp {p.budgetAllocated}
              </p>

              <p className="text-xs text-gray-500">
                Division: {p.division?.name}
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(p);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(p.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="font-bold text-lg mb-4">
              {editMode ? "Edit Project" : "Tambah Project"}
            </h3>

            <Input
              placeholder="Nama project"
              className="mb-3"
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            />

            <Input
              placeholder="Budget"
              type="number"
              className="mb-3"
              value={form.budgetAllocated}
              onChange={(e) =>
                setForm({ ...form, budgetAllocated: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpenModal(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmit}>
                {editMode ? "Simpan" : "Tambah"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="font-bold text-lg mb-3">Hapus project ini?</h3>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsByDivision;
