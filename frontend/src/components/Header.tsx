import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BravoLogo from "../assets/BravoLogoGronn-2.png";


function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-[#002250] text-white py-6.5 px-6 flex justify-between items-center relative">
      <img src={BravoLogo} alt="Bravo Logo" className="h-19.5 px-6" />
      
      {!isAuthPage && (
        <div className="flex items-center gap-4">
         
          <div onClick={() => setMenuOpen(!menuOpen)} className="text-pink-400 text-3xl cursor-pointer">☰</div>
        </div>
      )}
      
      {/* Sidebar Menu */}
      {menuOpen && (
        <div className="absolute right-4 top-16 bg-[#0D2A51] p-4 rounded-lg shadow-lg w-40">
          <ul className="space-y-2">
            <li><Link to="/dashboard" className={location.pathname === "/dashboard" ? "text-green-400" : "text-white"}>Home</Link></li>
            <li><Link to="/profile" className={location.pathname === "/profile" ? "text-green-400" : "text-white"}>Profile</Link></li>
            <li><Link to="/support" className={location.pathname === "/support" ? "text-green-400" : "text-white"}>Support</Link></li>
            <li><Link to="/settings" className={location.pathname === "/settings" ? "text-green-400" : "text-white"}>Settings</Link></li>
            <li><button onClick={handleLogout} className="text-red-400">Sign out</button></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Header;