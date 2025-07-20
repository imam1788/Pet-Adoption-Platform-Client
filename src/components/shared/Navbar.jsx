import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import logo from "../../assets/adoption.png"

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobile, setMobile] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Pet Listing", path: "/pets" },
    { label: "Donation Campaigns", path: "/donations" },
  ];

  const isActive = (path) => location.pathname === path;

  const NavButton = ({ path, label }) => (
    <button
      onClick={() => {
        navigate(path);
        setMobile(false);
      }}
      className={`relative font-medium px-2 py-1 text-gray-700 transition after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-primary after:transition-width ${isActive(path)
        ? "text-primary after:w-full"
        : "after:w-0 hover:after:w-full"
        }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <img src={logo} alt="PetAdopt Logo" className="w-8 h-8" />
          <span className="text-2xl font-extrabold">
            <span className="text-primary">Pet</span>
            <span className="text-amber-500">Haven</span>
          </span>
        </button>
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <NavButton key={item.path} {...item} />
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobile(!mobile)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobile && (
        <div className="md:hidden flex flex-col bg-white border-t px-6 pb-4 space-y-3">
          {navItems.map((item) => (
            <NavButton key={item.path} {...item} />
          ))}
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      )}
    </header>
  );
}
