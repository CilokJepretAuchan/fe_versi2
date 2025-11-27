import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroDashboard from "@/assets/hero-dashboard.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Mohon isi semua field");
      return;
    }

    try {
      const res = await fetch(
        "https://backend-auchan-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        toast.error("Email atau password salah");
        return;
      }

      const resJson = await res.json();
      const payload = resJson.data;

      localStorage.setItem("user", JSON.stringify(payload.user));
      localStorage.setItem("token", payload.token);

      const role =
        payload?.user?.members?.[0]?.role?.name ??
        payload?.user?.role?.name ??
        "";

      if (role) localStorage.setItem("role", role);

      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">

      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center px-10 lg:px-20">
        
        {/* LOGO + TITLE */}
        <div className="mb-10 flex items-center gap-2">
          <img 
            src="/logo-auchan.png"
            alt="AuChan Logo"
            className="w-10 h-10 object-contain"
          />
          <div>

          </div>
          
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AuChan
            </h1>
            <p className="text-sm text-muted-foreground -mt-1">
              Secure Access
            </p>
          </div>
        </div>

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
        <p className="mt-2 mb-8 text-muted-foreground">
          Access your transparent & AI-powered financial dashboard
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-primary shadow-glow"
            size="lg"
          >
            Login
          </Button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-sm text-muted-foreground mt-6">
         Don’t have an account yet?{" "}
          <Link
            to="/register"
            className="font-medium bg-gradient-primary bg-clip-text text-transparent hover:opacity-80"
          >
            Register
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE — IMAGE PREVIEW */}
      <div className="hidden md:flex items-center justify-center p-12 bg-gradient-to-br from-primary/10 to-background">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-primary/20 max-w-md">
          <img
            src={heroDashboard}
            alt="Dashboard Preview"
            className="w-full h-auto"
          />
          <div className="p-6 bg-white border-t border-gray-200">
            <h3 className="text-xl font-bold text-foreground">
              Smart Financial Transparency
            </h3>
            <p className="text-muted-foreground mt-2">
              Blockchain ledger + AI audit in one unified dashboard.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
