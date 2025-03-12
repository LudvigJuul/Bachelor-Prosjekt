import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/api/signup", { name, email, password });
      alert("User registered successfully!");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
  };

  return (
    <Layout>
    <div className="flex flex-col items-center p-4 bg-[#f5fffa]">
      <h1 className="text-2xl font-bold mt-6">Register Account</h1>
      <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 shadow-md rounded-lg w-1/3">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded w-full mb-4" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded w-full mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded w-full mb-4" required />
        <button type="submit" className="bg-[#ff69b4] text-white p-2 rounded w-full mb-4">Register</button>
        <button type="button" onClick={() => navigate("/")} className="bg-gray-300 text-black p-2 rounded w-full">
            Login
          </button>
      </form>
    </div>
    </Layout>
  );
}

export default Signup;
