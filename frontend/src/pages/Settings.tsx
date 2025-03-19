import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

interface Device {
  id: number;
  name: string;
  type: string;
}

function Settings() {
  const [user, setUser] = useState<any>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    profile_pic: "",
  });

  const [devices, setDevices] = useState<Device[]>([]);  // Enhetsliste
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("PC"); 

  useEffect(() => {
    const fetchProfileAndDevices = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, redirecting...");
        setLoading(false);
        return;
      } try {
        const profileResponse = await axios.get("http://127.0.0.1:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileResponse.data);
        const devicesResponse = await axios.get("http://127.0.0.1:5000/api/devices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDevices(devicesResponse.data);
      } catch (error) {
        console.error("Error fetching profile or devices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndDevices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://127.0.0.1:5000/api/profile", user, {
        headers: { Authorization: `Bearer ${token}` },});
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("An error occurred while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  // Legg til enheter
  const handleAddDevice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    } try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/devices",
        { name: deviceName, type: deviceType },
        { headers: { Authorization: `Bearer ${token}` }});
      if (!response.data.device) {
        console.error("Unexpected response format", response.data);
        return;
      }
      setDevices([...devices, response.data.device]); 
      setIsModalOpen(false);
      setDeviceName("");
    } catch (error) {
      console.error("Error adding device", error);
    }
  }

  // Fjern enheter
  const handleRemoveDevice = async (deviceId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:5000/api/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(devices.filter((device) => device.id !== deviceId));
    } catch (error) {
      console.error("Error removing device", error);
      alert("Failed to remove device.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-6 text-[#10305B]">
        <h1 className="text-[#002250] text-2xl font-bold mb-4">Edit Profile</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md border border-gray-200">

          <label className="block mb-2">Name:
            <input type="text" name="name" value={user.name} onChange={handleChange} className="w-full border p-2 rounded" required/>
          </label>

          <label className="block mb-2">Title:
            <input type="text" name="title" value={user.title} onChange={handleChange} className="w-full border p-2 rounded" required/>
          </label>

          <label className="block mb-2">Company:
            <input type="text" name="company" value={user.company} onChange={handleChange} className="w-full border p-2 rounded" required/>
          </label>

          <label className="block mb-2">Email:
            <input type="email" name="email" value={user.email} onChange={handleChange} className="w-full border p-2 rounded" required/>
          </label>

          <label className="block mb-2">Phone:
            <input type="text" name="phone" value={user.phone} onChange={handleChange} className="w-full border p-2 rounded" required/>
          </label>

          <button type="submit"
            className="mt-4 bg-[#10305B] text-white py-2 px-4 rounded hover:bg-[#081b3c] transition"
            disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </form>

        {/* Enhetsliste */}
        <h2 className="text-[#002250] text-2xl font-bold pt-10">My Devices</h2>
        <div className="mt-6 w-full max-w-md bg-white shadow-lg p-4 rounded-xl border border-gray-200">
          {devices.length === 0 ? (
            <p className="text-gray-500">No Devices registered</p>
          ) : (
            <ul>
              {devices.map((device) => (
                <li key={device.id} className="border-b p-2 flex justify-between items-center">
                  <span>{device.name} - {device.type}</span>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleRemoveDevice(device.id)}>Delete
                  </button>
              </li>
            ))}
          </ul>
          )}
        </div>

      {/* Knapp for å åpne modal */}
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(true)}
            >Add Device</button>

            {/* Modal-vindu for å legge til enheter */}
        {isModalOpen && (
          <div className="bg-[rgba(245,253,249,0.9)] fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Add Device</h2>

              <label className="block text-gray-700">Device Name:</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="MacBook Pro"/>

              <label className="block text-gray-700">Type:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}>
                <option value="Desktop">Desktop</option>
                <option value="Phone">Phone</option>
                <option value="Tablet">Tablet</option>
                <option value="Headset">Headset</option>
                <option value="Mic">Mic</option>
              </select>

              <div className="flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setIsModalOpen(false)}>Cancel</button>

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleAddDevice}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Settings;
