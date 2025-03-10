import Layout from "../components/Layout";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import GridLayout from "react-grid-layout";
import { useState, useEffect } from "react";
import { X, Move, Scaling } from "lucide-react"; 
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const allWidgets = [
  { id: "devices", name: "Status Devices" },
  { id: "usage", name: "Device Usage" },
  { id: "activity", name: "Activity" },
  { id: "ai", name: "AIchart" },
];

const initialLayout = [
  { i: "devices", x: 0, y: 0, w: 1, h: 1, static: false },
  { i: "usage", x: 1, y: 0, w: 1, h: 1, static: false },
  { i: "ai", x: 1, y: 0, w: 1, h: 1, static: false},
  { i: "activity", x: 0, y: 1, w: 2, h: 1, static: false },
];

const COLORS = ["#ffbae8", "#29f185", "#002250"];

const dataPie = [
  { name: "Web", value: 30 },
  { name: "Tablet", value: 20 },
  { name: "Mobile", value: 50 },
];
const dataBar = [
  { name: "Landing", sales: 40 },
  { name: "01.01.25", sales: 50 },
  { name: "14.01.25", sales: 60 },
  { name: "25.02.25", sales: 20 },
];

const aiWidget = [
  { name: "AI", value: 50 },
  { name: "Obi", value: 20 },
  { name: "Luke", value: 10 },
]

function Dashboard() {
  const [layout, setLayout] = useState(initialLayout);
  const [widgets, setWidgets] = useState(["devices", "usage", "activity", "ai"]);
  const [gridWidth, setGridWidth] = useState(window.innerWidth * 0.9); // Start med 90% av skjermen
  const [gridHeight, setGridHeight] = useState(window.innerHeight * 0.8); // Start med 80% av skjermen

  const removeWidget = (id: string) => {
    setWidgets((prevWidgets) => prevWidgets.filter((widget) => widget !== id));
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== id));
  };

  const addWidget = (id: string) => {
    setWidgets((prevWidgets) => [...prevWidgets, id]);
    setLayout((prevLayout) => [
      ...prevLayout,
      {
        i: id,
        x: 0,
        y: 0,
        w: id === "devices" ? 2 : 1, // Endre bredde basert på widget-type
        h: id === "activity" ? 2 : 1, // Endre høyde basert på widget-type
        static: false,
      },
    ]);
  };

  useEffect(() => {
    const handleResize = () => {
      setGridWidth(window.innerWidth * 0.9); // Justerer bredden dynamisk
      setGridHeight(window.innerHeight * 0.8); // Justerer høyden dynamisk
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>
      {/* Header text */}
      <div className="min-h-screen text-white p-6">
        <h1 className="text-[#002250] text-3xl font-weight: 900; font-medium font-sans mb-4">Dashboard</h1>

        {/* Widget Meny */}
        <div className="mb-4 flex gap-2">
          {allWidgets.map(({ id, name }) => (
            !widgets.includes(id) && (
              <button
                key={id}
                onClick={() => addWidget(id)}
                className="bg-[#ff75d1]  hover:bg-[#ffbae8] text-white font-sans font-medium px-4 py-2 rounded-lg shadow">
                Legg til {name}
              </button>
            )
          ))}
        </div>

        {/* Dashboard Layout */}
        <GridLayout
          className="grid-layout"
          layout={layout}
          cols={3}
          rowHeight={gridHeight / 3} // Tilpass rad-høyde
          width={gridWidth} // Dynamisk bredde
          onLayoutChange={(newLayout) => setLayout(newLayout.map(item => ({ ...item, static: false })))}
          isResizable={true}
          resizeHandles={["se"]}
          draggableCancel=".no-drag"
        >

          {/* Status Devices Widget */}
          {widgets.includes("devices") && (
            <div key="devices" className="bg-[#d3f6e6] p-4 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {event.stopPropagation(); removeWidget("devices");}}>
                <X size={20}/>
              </button>
              <h2 className="text-[#002250] text-2xl  font-medium font-sans mb-4">Status Devices</h2>
              <div className="flex justify-between mt-4">
                <div className="text-[#ffffff] text-1xl  font-medium font-sans mb-4 bg-[#ff75d1] p-4 rounded-lg">Active 13</div>
                <div className="text-[#ffffff] text-1xl  font-medium font-sans mb-4 bg-[#29f185] p-4 rounded-lg">Inactive 30</div>
              </div>
              <div className="absolute bottom-2 right-2 text-gray-400"><Scaling size={16} /></div>
              <div className="absolute bottom-2 left-2 text-gray-400"><Move size={16} /></div>
            </div>
          )}

          {/* Device Usage Widget */}
          {widgets.includes("usage") && (
            <div key="usage" className="bg-[#002250] p-4 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {event.stopPropagation(); removeWidget("usage");}}>
                <X size={20}/>
              </button>
              <h2 className="text-[#ffffff] text-2xl  font-medium font-sans mb-4">Device Usage</h2>
              <PieChart width={300} height={300}>
                <Pie data={dataPie} cx={100} cy={100} outerRadius={60} fill="#8884d8" dataKey="value">
                  {dataPie.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                </Pie>
              </PieChart>
              <div className="absolute bottom-2 right-2 text-gray-400"><Scaling size={16}/></div>
              <div className="absolute bottom-2 left-2 text-gray-400"><Move size={16}/></div>
            </div>
          )}

          {/* Activity Widget */}
          {widgets.includes("activity") && (
            <div key="activity" className="bg-gradient-to-b from-[#002250] to-[#f6c5e8] p-4 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {event.stopPropagation(); removeWidget("activity");}}>
                <X size={20}/>
              </button>
              <h2 className="text-[#ffffff] text-2xl  font-medium font-sans mb-4">Activity</h2>
              <BarChart width={300} height={200} data={dataBar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#29f185" />
              </BarChart>
              <div className="absolute bottom-2 right-2 text-gray-400"><Scaling size={16}/></div>
              <div className="absolute bottom-2 left-2 text-gray-400"><Move size={16}/></div>
            </div>
          )}

          {/* AI Widget */}
          {widgets.includes("ai") && (
            <div key="ai" className="bg-[#f5f9ff] p-4 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {event.stopPropagation(); removeWidget("ai");}}>
                <X size={20} />
              </button>
              <h2 className="text-[#002250] text-2xl  font-medium font-sans mb-4">AI</h2>
              <PieChart width={300} height={300}>
                <Pie data={dataPie} cx={100} cy={100} outerRadius={60} fill="#002250" dataKey="value">
                  {aiWidget.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                </Pie>
              </PieChart>
              <div className="absolute bottom-2 right-2 text-gray-400"><Scaling size={16}/></div>
              <div className="absolute bottom-2 left-2 text-gray-400"><Move size={16}/></div>
            </div>
          )}
        </GridLayout>
      </div>
    </Layout>
  );
}

export default Dashboard;
