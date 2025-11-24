import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Shield, Lock, Bot, Users } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "Transparansi Keuangan",
      description: "Setiap transaksi tercatat dengan jelas dan dapat diaudit kapan saja.",
    },
    {
      icon: Lock,
      title: "Anti Manipulasi",
      description: "Blockchain ledger memastikan data tidak dapat diubah atau dihapus.",
    },
    {
      icon: Bot,
      title: "Audit Otomatis",
      description: "AI mendeteksi anomali dan potensi fraud secara real-time.",
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Kontrol akses berdasarkan peran untuk keamanan maksimal.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Audit-Chan – Smart{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Financial Transparency
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Blockchain-powered financial audit with AI fraud detection. Kelola
                keuangan dengan transparansi penuh dan keamanan tingkat enterprise.
              </p>
              <div className="flex gap-4">
                <Link to="/login">
                  <Button size="lg" className="rounded-xl shadow-glow">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="rounded-xl">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-glow border-4 border-primary/20">
                <img
                  src={heroDashboard}
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Fitur Unggulan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border hover:shadow-glow transition-all duration-300"
                >
                  <div className="mb-4 p-3 bg-gradient-primary rounded-xl w-fit shadow-glow">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-card border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Audit-Chan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
