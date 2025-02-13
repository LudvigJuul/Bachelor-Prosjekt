
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="bg-[#0D2A51] text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-green-400 text-2xl font-bold">bravo</h1>
      <ul className="flex gap-6">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to= "../serverlink">Server info</Link></li>
      </ul>
      <div className="text-pink-400 text-3xl cursor-pointer">☰</div>
    </nav>
  );
}

export default Header;