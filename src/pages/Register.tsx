import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // opsi organisasi
  const [mode, setMode] = useState<"create" | "join">("create");

  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [orgCode, setOrgCode] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Mohon isi semua field wajib");
      return;
    }

    if (mode === "create" && (!orgName || !orgDesc)) {
      toast.error("Mohon isi nama dan deskripsi organisasi");
      return;
    }

    if (mode === "join" && !orgCode) {
      toast.error("Masukkan kode organisasi untuk bergabung");
      return;
    }

    const payload =
      mode === "create"
        ? {
            name,
            email,
            password,
            orgName,
            orgDesc,
            orgCode: orgCode || undefined,
          }
        : {
            name,
            email,
            password,
            orgCode,
          };

    try {
      const res = await fetch(
        "https://backend-auchan-production.up.railway.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registrasi gagal");
        return;
      }

      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      toast.error("Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-glow p-8 border border-border">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-xl shadow-glow">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Daftar untuk mulai menggunakan Audit-Chan
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Nama */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Mode Create / Join */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant={mode === "create" ? "default" : "outline"}
                onClick={() => setMode("create")}
                className="w-full"
              >
                Buat Organisasi
              </Button>

              <Button
                type="button"
                variant={mode === "join" ? "default" : "outline"}
                onClick={() => setMode("join")}
                className="w-full"
              >
                Gabung Organisasi
              </Button>
            </div>

            {/* FORM CREATE ORG */}
            {mode === "create" && (
              <>
                <div className="space-y-2">
                  <Label>Nama Organisasi</Label>
                  <Input
                    type="text"
                    placeholder="Nama organisasi"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deskripsi Organisasi</Label>
                  <Input
                    type="text"
                    placeholder="Deskripsi"
                    value={orgDesc}
                    onChange={(e) => setOrgDesc(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </>
            )}

            {/* FORM JOIN ORG */}
            {mode === "join" && (
              <div className="space-y-2">
                <Label>Kode Organisasi</Label>
                <Input
                  type="text"
                  placeholder="Masukkan kode (contoh: AB12CD)"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl shadow-glow" size="lg">
              Register
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
