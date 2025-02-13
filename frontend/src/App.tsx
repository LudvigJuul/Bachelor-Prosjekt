import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react"; 
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import './App.css'

function App() {
  
  type ApiRespone = {
    name: string;
    version: String;
  }

  const [data, setData] = useState<ApiRespone | null>(null);
  
    useEffect(() => {
      fetch("http://127.0.0.1:5000/")
        .then((response) => response.json())
        .then((data : ApiRespone) => setData(data));
    }, []);
  
    return (
    <Router>
      <div>
        <h1>Flask + React</h1>
        {data ? <p>{data.name} - v{data.version}</p> : <p>Laster data...</p>}
      </div>

      {<Header />}
          <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        <Footer />
    </Router>
    );
  
}


export default App;

