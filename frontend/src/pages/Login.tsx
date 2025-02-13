import React, { useState } from "react";
import axios from "axios";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", { email, password });
      console.log(response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex flex-grow items-center justify-center">
        <div className="bg-white p-8 shadow-lg rounded-md w-96">
          <h2 className="text-lg font-bold mb-4">Email</h2>
          <input
            type="email"
            placeholder="test@test.com"
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
          />

          <h2 className="text-lg font-bold mt-4 mb-2">Password</h2>
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-between mt-4">
            <button className="button-primary">Forgot password?</button>
            <button type="submit" onClick={handleLogin} className="button-secondary">Sign in</button>
          </div>

          <button className="mt-4 w-full button-primary">Register account</button>
        </div>
      </div>
      
    </div>
  );
}

export default Login;