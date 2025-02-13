import { useState } from "react";


function Signup() {
    const [name, setName] = useState("");
    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //add_user()?

  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex flex-grow items-center justify-center">
        <div className="bg-white p-8 shadow-lg rounded-md w-96">
          <h2 className="text-lg font-bold mb-2">Name</h2>
          <input
            type="text"
            placeholder="Name"
            className="input-field"
            onChange={(e) => setName(e.target.value)}
          />

          <h2 className="text-lg font-bold mt-4 mb-2">Organisation</h2>
          <select
            className="input-field"
            onChange={(e) => setOrganization(e.target.value)}
          >
            <option>Company</option>
            <option>Startup</option>
            <option>Individual</option>
          </select>

          <h2 className="text-lg font-bold mt-4 mb-2">Email</h2>
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

          <button className="mt-4 w-full button-primary">Register account</button>
        </div>
      </div>

    </div>
  );
}

export default Signup;

{/* 
  
  server.py inneholder en funksjon som heter "add_user()" som tilsynelatende legger til brukere i databasen. Dette må knyttes opp her på en eller annen måte? Tror jeg. 
  
  */}