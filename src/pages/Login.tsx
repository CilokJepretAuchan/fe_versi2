import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Mohon isi semua field");
      return;
    }

    // Dummy login
    localStorage.setItem("user", JSON.stringify({ email, name: "User" }));
    toast.success("Login berhasil!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-6">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-glow p-8 border border-border">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-xl shadow-glow">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Login ke akun Audit-Chan Anda
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <Button type="submit" className="w-full rounded-xl shadow-glow" size="lg">
              Login
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
