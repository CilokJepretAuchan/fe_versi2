import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
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
      const payload = resJson.data; // sesuai backendmu

      // simpan user ke localStorage
      localStorage.setItem("user", JSON.stringify(payload.user));

      // simpan token ke localStorage
      localStorage.setItem("token", payload.token);

      // tentukan role
      const role =
        payload?.user?.members?.[0]?.role?.name ??
        payload?.user?.role?.name ??
        "";

      if (role) {
        localStorage.setItem("role", role);
      }

      toast.success("Login berhasil!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center px-10 lg:px-20">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0EA5E9] rounded-full flex items-center justify-center">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AuChain</h1>
            <p className="text-sm text-gray-500 -mt-1">Secure Access</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800">
          AuChain Secure Access
        </h2>
        <p className="mt-2 mb-8 text-gray-600">
          Login to access your blockchain-verified financial transparency dashboard
        </p>

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
            className="w-full rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7]"
            size="lg"
          >
            Login Securely
          </Button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-[#0EA5E9] font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex items-center justify-center p-10">
        <div className="bg-white shadow-xl rounded-3xl p-10 w-[85%] max-w-xl border border-gray-200">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#0EA5E9] flex items-center justify-center">
              <Shield className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl">→</span>
            <div className="w-12 h-12 rounded-xl bg-[#0EA5E9] flex items-center justify-center">
              <BarChart3 className="text-white w-7 h-7" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#F0F9FF] p-3 rounded-lg text-center">
              Blockchain Verified
            </div>
            <div className="bg-[#F0F9FF] p-3 rounded-lg text-center">
              Full Transparency
            </div>
            <div className="bg-[#F0F9FF] p-3 rounded-lg text-center">
              Secure Access
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
