import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import heroDashboard from "@/assets/hero-dashboard.png";
import { Shield, Lock, Bot, Users, Workflow, HelpCircle } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "Financial Transparency",
      description: "Every transaction is clearly recorded and can be audited at any time.",
    },
    {
      icon: Lock,
      title: "Anti Manipulation",
      description: "Blockchain ledger ensures data cannot be altered or deleted.",
    },
    {
      icon: Bot,
      title: "Automatic Audit",
      description: "AI detects anomalies in real-time.",
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Access control based on roles for maximum security.",
    },
  ];

  const howItWorks = [
    { step: "Upload Data", desc: "Import transactions or manual input." },
    { step: "Blockchain Recording", desc: "Data is stored securely and transparently." },
    { step: "AI Detection", desc: "The system identifies anomalies." },
    { step: "Audit Report", desc: "Results appear directly on the dashboard and can be downloaded." },
  ];

  const faq = [
    { q: "Is the data secure?", a: "Yes, data is encrypted and recorded on the blockchain." },
    { q: "Do I need accounting expertise?", a: "No, the system automatically analyzes the data." },
    { q: "Is it free?", a: "There is a free plan for small organizations." },
    { q: "Is installation required?", a: "No, the application is fully web-based." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative bg-gradient-primary/5">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
    
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              AuChan – Smart{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Financial Transparency
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Blockchain-powered financial audit with AI detection for future-ready organizations.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link to="/login">
                <Button size="lg" className="rounded-xl px-8 py-4 text-lg">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-4 text-lg border-primary text-primary hover:bg-primary/10"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20 bg-white">
            <img src={heroDashboard} alt="Dashboard Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Features</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
            Cutting-edge technology to maintain financial integrity.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
            Automatic audit process in 4 simple steps.
          </p>

          <div className="grid md:grid-cols-4 gap-10 relative">
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-primary/20"></div>

            {howItWorks.map((step, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>

                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Workflow className="w-10 h-10 text-primary" />
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-900">{step.step}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">FAQ</h2>
          <p className="text-gray-600 text-lg mb-16">Frequently Asked Questions</p>

          <div className="space-y-6 max-w-3xl mx-auto text-left">
            {faq.map((item, i) => (
              <div
                key={i}
                className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.q}</h3>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-gradient-primary/5">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white border-2 border-primary/20 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Start Smart Financial Auditing</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Enhance transparency and financial security with blockchain and AI.
            </p>

            <Button className="px-10 py-5 text-lg rounded-xl shadow-lg" asChild>
              <Link to="/register">Try Now - Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-4">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              AuChan
            </h3>
            <p className="text-gray-600">Smart Financial Transparency Platform</p>
          </div>

          <div className="flex justify-center gap-8 mb-6 text-sm">
            <a className="text-gray-600 hover:text-primary transition-colors">About Us</a>
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a className="text-gray-600 hover:text-primary transition-colors">Contact</a>
          </div>

          <p className="text-gray-500 text-sm">© 2025 Audit-Chan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
