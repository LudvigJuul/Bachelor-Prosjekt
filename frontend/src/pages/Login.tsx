import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data } = await axios.post("http://127.0.0.1:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Wrong e-mail or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center p-4 bg-[#f5fffa] min-h-screen">
        <h1 className="text-2xl font-bold mt-6">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-4 bg-white p-6 shadow-md rounded-lg w-full max-w-md"
        >
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded w-full mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full mb-2"
            required
          />

          <div className="text-right mb-4">
            <button
              type="button"
              onClick={() => navigate("/forgotPassword")}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {errorMessage && (
            <div className="text-red-600 mb-4 text-sm">{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff69b4] text-white p-2 rounded w-full mb-4 flex justify-center items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              "Login"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="bg-gray-300 text-black p-2 rounded w-full"
          >
            Create Account
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Login;