import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";
import Layout from "../components/Layout";

function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting...");
        return;
      } try {
        const response = await axios.get("http://127.0.0.1:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-[#10305B] p-6">
      <h1 className="text-[#002250] text-3xl font-weight: 900; font-medium font-sans mb-10">Profile</h1>
        <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-lg border border-gray-200 ">
          <div className="flex items-center gap-4">
            <img
              src={user.profile_pic}
              alt="User Avatar"
              className="w-100 h-100 rounded-full border-4 border-[#10305B]"
              style={{ width: "150px", height: "150px", objectFit: "contain" }}
            />
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-lg text-gray-600">{user.title} at {user.company}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">About Me</h2>
            <p className="text-gray-700 mt-2">
              {user.name} jobber hos {user.company} som {user.title}.
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Contact</h2>
            <div className="flex flex-col gap-2 mt-2 text-gray-700">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-[#10305B]" /> {user.email}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#10305B]" /> {user.phone || "N/A"}
              </p>
              <a href="#" className="flex items-center gap-2 text-[#10305B] hover:text-[#081b3c]">
                <FaLinkedin /> linkedin.com/in/{user.name.replace(" ", "").toLowerCase()}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
