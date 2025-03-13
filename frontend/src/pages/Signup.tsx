import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("company", company);
    formData.append("title", title);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      await axios.post("http://127.0.0.1:5000/api/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center p-4 bg-[#f5fffa] min-h-screen">
        <h1 className="text-2xl font-bold mt-6">Register Account</h1>
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 shadow-md rounded-lg w-full max-w-md">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded w-full mb-4" required />
          <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="p-2 border rounded w-full mb-4" />
          <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border rounded w-full mb-4" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded w-full mb-4" required />
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-2 border rounded w-full mb-4" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded w-full mb-4" required />
          
          <label className="block mb-2 font-semibold">Upload Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border rounded w-full mb-4" />
          
          {preview && (
            <div className="flex justify-center my-4">
              <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full border border-gray-300" />
            </div>
          )}

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