import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import "tailwindcss";

/* 
//
// 
// 
// 
// HVIS DERE RØRER DENNE BITEN SÅ DREPER JEG DERE NULL KØDD EKTE SERR!
*/

import { init as initApm } from '@elastic/apm-rum';

const apm = initApm({
  serviceName: 'your-frontend-service-name',
  serverUrl: 'http://localhost:8200',  // Replace with your APM Server URL
  environment: 'production', // Or 'development', depending on your environment
});

/* 
////////////////////////////////////////////
*/

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;