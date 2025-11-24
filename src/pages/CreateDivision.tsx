"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/router"; // <-- Fixed

const CreateDivision = () => {
  const [divisions, setDivisions] = useState<string[]>([]);
  const [newDivision, setNewDivision] = useState("");
  const router = useRouter(); // <-- Fixed

  const handleAddDivision = () => {
    if (!newDivision.trim()) {
      toast.error("Nama divisi tidak boleh kosong!");
      return;
    }

    setDivisions([...divisions, newDivision]);
    setNewDivision("");
    toast.success("Divisi berhasil ditambahkan!");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Create Division</h1>
          <p className="text-muted-foreground mb-8">
            Tambahkan divisi dan atur proyeknya.
          </p>

          {/* Input Add Division */}
          <div className="flex gap-3 mb-8">
            <Input
              placeholder="Nama divisi baru"
              value={newDivision}
              onChange={(e) => setNewDivision(e.target.value)}
              className="rounded-xl"
            />
            <Button className="rounded-xl" onClick={handleAddDivision}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </div>

          {/* List Division Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {divisions.map((name, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-xl transition rounded-2xl"
                onClick={() =>
                  router.push(`/create-project?division=${encodeURIComponent(name)}`)
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Klik untuk membuat project pada divisi ini
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateDivision;
