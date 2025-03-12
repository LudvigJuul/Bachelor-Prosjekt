import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://127.0.0.1:5000/api/login", { email, password });

      localStorage.setItem("token", data.token); 
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center p-4 bg-[#f5fffa]">
        <h1 className="text-2xl font-bold mt-6">Login</h1>
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 shadow-md rounded-lg w-1/3">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded w-full mb-4" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded w-full mb-4" required />
          <button type="submit" className="bg-[#ff69b4] text-white p-2 rounded w-full mb-4">Login</button>
          <button type="button" onClick={() => navigate("/signup")} className="bg-gray-300 text-black p-2 rounded w-full">
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Login;