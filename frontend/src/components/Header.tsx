import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BravoLogo from "../assets/BravoLogoGronn-2.png";
import {Menu, X, LogOut} from "lucide-react";
import { motion,AnimatePresence } from "framer-motion";
// import { CheckCircle } from "lucide-react";


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
        <div className="flex items-center gap-3">
          {/* Meny-knapp */}
          <div onClick={() => setMenuOpen(!menuOpen)} className="text-[#ff75d1] hover:text-[#ffbae8] text-4xl cursor-pointer">
            {menuOpen ? <X size={40}/> : <Menu size={40} />}
          </div>
        </div>
      )}
      
      {/* Sidebar Menu */}
      
<AnimatePresence>
{menuOpen && (
  <motion.div 
    initial={{ opacity: 0, y: -50, scale: 0.7 }}
    animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }}
    exit={{ opacity: 0, x: 100, scale: 0.7, transition: { type: "spring", stiffness: 300, damping: 20 } }}
    className="absolute right-[25px] top-[130px] bg-[#ff75d1] p-4 rounded-lg shadow-lg w-60 h-60 z-999"
    role="menu"
    aria-label="User menu"
  >
    <ul className="space-y-5 text-[#002250] font-normal font-sans">
      <li><Link to="/dashboard" className={location.pathname === "/dashboard" ? "text-green-400 font-medium" : "font-medium"}>Dashboard</Link></li>
      <li><Link to="/profile" className={location.pathname === "/profile" ? "text-green-400 font-medium" : "font-medium"}>Profile</Link></li>
      <li><Link to="/support" className={location.pathname === "/support" ? "text-green-400 font-medium" : "font-medium"}>Support</Link></li>
      <li><Link to="/settings" className={location.pathname === "/settings" ? "text-green-400 font-medium" : "font-medium"}>Settings</Link></li>
      <li>
        <button onClick={handleLogout} className="text-red-700 flex items-center gap-2">
          <LogOut size={20} />
          Sign out
        </button>
      </li>
    </ul>
  </motion.div>
)}
</AnimatePresence>
    </nav>
  );
}

export default Header;