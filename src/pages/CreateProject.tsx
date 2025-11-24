"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/router";

const CreateProject = () => {
  const router = useRouter();
  const { division } = router.query;

  const [projectName, setProjectName] = useState("");

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast.error("Nama proyek tidak boleh kosong!");
      return;
    }

    toast.success("Proyek berhasil dibuat!");

    setTimeout(() => {
      router.push(
        `/add-transaction?division=${division}&project=${encodeURIComponent(
          projectName
        )}`
      );
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Create Project</h1>

          <p className="text-muted-foreground mb-6">
            Divisi: <span className="font-semibold">{division}</span>
          </p>

          <Input
            placeholder="Nama project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="rounded-xl mb-4"
          />

          <Button className="w-full rounded-xl" onClick={handleCreateProject}>
            Simpan Project
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;
