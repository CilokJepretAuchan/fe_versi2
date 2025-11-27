import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// Asumsi: Anda mengimpor gambar seperti ini dari folder assets
import heroDashboard from "@/assets/hero-dashboard.png";
import { Shield } from "lucide-react";


const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"create" | "join">("create");

  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [orgCode, setOrgCode] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (mode === "create" && (!orgName || !orgDesc)) {
      toast.error("Please fill in organization name and description");
      return;
    }

    if (mode === "join" && !orgCode) {
      toast.error("Please enter organization code to join");
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
    // Menggunakan grid 2 kolom yang sama seperti di Login
    <div className="grid min-h-screen lg:grid-cols-2">
      
      {/* Kolom Kiri: Visual/Promosi (Disesuaikan dengan format Card Login) */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-primary/10 to-background">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-primary/20 max-w-md">
          
          {/* Gambar Ilustrasi */}
          <img
            src={heroDashboard} // Menggunakan variabel import
            alt="Audit Illustration"
            className="w-full h-auto"
          />

          {/* Konten Card (Disesuaikan dari Login) */}
          <div className="p-6 bg-white border-t border-gray-200">
            <h3 className="text-xl font-bold text-foreground">
              Audit made easy with AuChan
            </h3>
            <p className="text-muted-foreground mt-2">
              A unified platform to manage all your organization's audit activities efficiently and transparently.
            </p>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Form Register (Sama seperti sebelumnya) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-md">
          
          <div>
            
            {/* LOGO */}
            <div className="flex justify-start mb-6">
              <img
                src="/logo-auchan.png"
                alt="AuChan Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground mb-8">
              Join AuChan and manage audits seamlessly.
            </p>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg"
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
                  className="rounded-lg"
                />
              </div>

              {/* Toggle */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant={mode === "create" ? "default" : "outline"}
                  onClick={() => setMode("create")}
                  className="w-full rounded-lg"
                >
                  Create Org
                </Button>

                <Button
                  type="button"
                  variant={mode === "join" ? "default" : "outline"}
                  onClick={() => setMode("join")}
                  className="w-full rounded-lg"
                >
                  Join Org
                </Button>
              </div>

              {/* Create Form */}
              {mode === "create" && (
                <>
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input
                      type="text"
                      placeholder="Your organization"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      type="text"
                      placeholder="Short description"
                      value={orgDesc}
                      onChange={(e) => setOrgDesc(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </>
              )}

              {/* Join Form */}
              {mode === "join" && (
                <div className="space-y-2">
                  <Label>Organization Code</Label>
                  <Input
                    type="text"
                    placeholder="Enter code (e.g., AB12CD)"
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full rounded-lg"
                size="lg"
              >
                Register
              </Button>
            </form>

            {/* Bottom */}
            <p className="text-center text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;