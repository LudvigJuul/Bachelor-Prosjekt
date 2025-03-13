import Layout from "../components/Layout";
import { FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";

function Profile() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-[#10305B] p-6">
        
        {/* Profile Card */}
        <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-lg border border-gray-200 ">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <img
              src="https://carboncostume.com/wordpress/wp-content/uploads/2021/12/orbponderingwizard-meme.jpg"
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-[#10305B]"
            />
            <div>
              <h1 className="text-3xl font-bold">Test Bravo</h1>
              <p className="text-lg text-gray-600">Software Engineer at Bravo AS</p>
            </div>
          </div>

          {/* Work Details */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">About Me</h2>
            <p className="text-gray-700 mt-2">
              Passionate software engineer with 5+ years of experience in full-stack 
              development, specializing in modern web applications and scalable solutions.
            </p>
          </div>

          {/* Skills Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Skills</h2>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>JavaScript (React, Node.js, TypeScript)</li>
              <li>Swift & iOS Development</li>
              <li>Database Management (PostgreSQL, Firebase)</li>
              <li>Cloud & DevOps (AWS, Docker, CI/CD)</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Contact</h2>
            <div className="flex flex-col gap-2 mt-2 text-gray-700">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-[#10305B]" /> deez.nuts@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#10305B]" /> +1 (123) 420-6969
              </p>
              <a href="#" className="flex items-center gap-2 text-[#10305B] hover:text-[#081b3c]">
                <FaLinkedin /> linkedin.com/in/deeznuts
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;

