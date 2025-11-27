import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* === LOGO SAMAAN DENGAN DASHBOARD === */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-auchan.png"
              alt="AuChan Logo"
              className="w-10 h-10 object-contain"  // disamain size & style
            />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AuChan
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
