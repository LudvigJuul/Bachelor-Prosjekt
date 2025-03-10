import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BravoLogo from "../assets/BravoLogoGronn-2.png";
import {Menu, X, LogOut} from "lucide-react";


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
          {/* Meny-knapp */}
          <div onClick={() => setMenuOpen(!menuOpen)} className="text-[#ff75d1] hover:text-[#ffbae8] text-4xl cursor-pointer">
            {menuOpen ? <X size={40}/> : <Menu size={40} />}
          </div>
        </div>
      )}
      
      {/* Sidebar Menu */}
      {menuOpen && (
        <div className="absolute right-0 top-32.5 bg-[#002250] p-4 rounded-lg shadow-lg w-60 h-60 z-100">
          <ul className="space-y-5 text-[#F5FDF9] font-normal font-sans">
            <li><Link to="/dashboard" className={location.pathname === "/dashboard" ? "text-green-400" : ""}>Dashboard</Link></li>
            <li><Link to="/profile" className={location.pathname === "/profile" ? "text-green-400" : ""}>Profile</Link></li>
            <li><Link to="/support" className={location.pathname === "/support" ? "text-green-400" : ""}>Support</Link></li>
            <li><Link to="/settings" className={location.pathname === "/settings" ? "text-green-400" : ""}>Settings</Link></li>
            <li><button onClick={handleLogout} className="text-red-400 flex items-center gap-2">
                  <LogOut size={20} />
                    Sign out
                </button></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Header;