import Layout from "../components/Layout";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const dataPie = [
  { name: "Web", value: 30 },
  { name: "Tablet", value: 20 },
  { name: "Mobile", value: 50 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const dataBar = [
  { name: "Landing", sales: 40 },
  { name: "Sales 1", sales: 50 },
  { name: "Event 1", sales: 60 },
  { name: "Event 2", sales: 70 },
];

function Dashboard() {
  return (
    <Layout>
      <div className=" min-h-screen text-white p-6">
      <h1 className="text-green-400 text-2xl font-bold mb-4">Dashboard</h1>
        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#10305b] p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Status Devices</h2>
            <div className="flex justify-between mt-4">
              <div className="bg-green-400 p-4 rounded-lg">

                Active 13
                </div>
              <div className="bg-red-400 p-4 rounded-lg">Inactive 30</div>
            </div>
          </div>

          <div className="bg-[#10305B] p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Device Usage</h2>
            <PieChart width={200} height={200}>
              <Pie data={dataPie} cx={100} cy={100} outerRadius={60} fill="#8884d8" dataKey="value">
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>

        <div className="bg-[#10305b] p-4 rounded-lg shadow-lg mt-6">
          <h2 className="text-lg font-semibold">Activity</h2>
          <BarChart width={300} height={200} data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#00C49F" />
          </BarChart>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;