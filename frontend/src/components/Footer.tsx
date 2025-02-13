
import { FaEnvelope, FaPhone } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#0D2A51] text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <FaEnvelope className="text-green-400" />
        <p className="text-green-400">Eksempel123@eksempel.test</p>
      </div>
      <p className="text-green-400">© 2025 Bravo Project</p>
      <div className="flex items-center space-x-2">
        <FaPhone className="text-green-400" />
        <p className="text-green-400">+47 12 34 56 78</p>
      </div>
    </footer>
  );
}

export default Footer;