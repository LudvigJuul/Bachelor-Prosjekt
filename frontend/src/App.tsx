/*

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

export default App; */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css';
import "tailwindcss";

// Import Elastic APM Agent
import { init as initApm } from '@elastic/apm-rum';



// Initialize the APM agent

const apm = initApm({
  serviceName: 'your-frontend-service-name',  // Choose a name for your frontend service
  serverUrl: 'http://localhost:8200',         // APM Server URL
  environment: 'production',                 // Set it to 'development' for development environment
  // If using a secret token for authentication, add it like this:
  //secretToken: ''
});



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
