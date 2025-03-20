
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import GridLayout from "react-grid-layout";
import { useState, useEffect } from "react";
import { X, Move, Scaling } from "lucide-react"; 
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Layout as GridLayoutType } from "react-grid-layout"; 
import LayoutComponent from "../components/Layout"; 

const allWidgets = [
  { id: "devices", name: "Status Devices" },
  { id: "usage", name: "Device Usage" },
  { id: "activity", name: "Activity" },
  { id: "ai", name: "AIchart" },
];

const initialLayout = [
  { i: "devices", x: 3, y: 0, w: 3, h: 3, static: false },
  { i: "usage", x: 0, y: 0, w: 3, h: 3, static: false },
  { i: "ai", x: 0, y: 0, w: 3, h: 4, static: false},
  { i: "activity", x:6 , y: 0, w: 3, h: 3, static: false },
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

  const findNextAvailablePosition = (layout: GridLayoutType[], widgetWidth: number = 3, cols: number = 10) => {
    let occupied = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
    let rowMap = new Array(cols).fill(0); // Holder høyden til hver kolonne
  
    occupied.forEach(({ x, y, w, h }) => {
      for (let i = x; i < x + w; i++) {
        rowMap[i] = Math.max(rowMap[i], y + h);
      }
    });
  
    // Finn første rad med nok plass til widgetWidth
    for (let y = 0; ; y++) {
      for (let x = 0; x <= cols - widgetWidth; x++) {
        if (rowMap.slice(x, x + widgetWidth).every(height => height <= y)) {
          return { x, y };
        }
      }
    }
  };

  const addWidget = (id: string) => {
    setWidgets((prevWidgets) => [...prevWidgets, id]);

    setLayout((prevLayout) => {
      const cols = 10; // Antall kolonner
      const widgetWidth = 3; // Standard widget bredde
      const { x, y } = findNextAvailablePosition(prevLayout, widgetWidth, cols);
      return [...prevLayout, { i: id, x, y, w: widgetWidth, h: 4, static: false }];
    });
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
    <LayoutComponent>
      {/* Header text */}
      <div className="p-6">
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
          cols={9}
          rowHeight={gridHeight / 12} // Tilpass rad-høyde
          width={gridWidth} // Dynamisk bredde
          style={{minHeight: "500px"}}
          onLayoutChange={(newLayout) => setLayout(newLayout.map(item => ({ ...item, static: false })))}
          isResizable={true}
          resizeHandles={["se"]}
          draggableCancel=".no-drag"
        >

          {/* Status Devices Widget */}
          {widgets.includes("devices") && (
            <div key="devices" className="bg-[#10305B] p-4 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {event.stopPropagation(); removeWidget("devices");}}>
                <X size={20}/>
              </button>
              <h2 className="text-[#50f49b] text-2xl  font-medium font-sans mb-4">Status Devices</h2>
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
            <div key="usage" className="bg-[#10305B] p-4 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {event.stopPropagation(); removeWidget("usage");}}>
                <X size={20}/>
              </button>
              <h2 className="text-[#50f49b] text-2xl font-medium font-sans mb-4">Device Usage</h2>
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
            <div key="activity" className="bg-[#10305B] p-4 rounded-lg shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {event.stopPropagation(); removeWidget("activity");}}>
                <X size={20}/>
              </button>
              <h2 className="text-[#50f49b] text-2xl  font-medium font-sans mb-4">Activity</h2>
              <BarChart width={300} height={200} data={dataBar}>
              <CartesianGrid stroke="white" strokeDasharray="3 3" />
                <XAxis stroke="white" dataKey="name" />
                <YAxis stroke="white" />
                <Tooltip />
                <Bar dataKey="sales" fill="#29f185" />
              </BarChart>
              <div className="absolute bottom-2 right-2 text-gray-400"><Scaling size={16}/></div>
              <div className="absolute bottom-2 left-2 text-gray-400"><Move size={16}/></div>
            </div>
          )}

{/* AI Widget */}
{widgets.includes("ai") && (
  <div key="ai" className="bg-[#10305B] p-4 rounded-lg shadow-lg relative">
    <button
      className="absolute top-2 right-2 text-red-400 hover:text-red-600 no-drag"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {event.stopPropagation(); removeWidget("ai");}}
    >
      <X size={20} />
    </button>
    <h2 className="text-[#50f49b] text-2xl font-medium font-sans mb-4">AI</h2>

    {/* Progress Circle */}
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#e0e0e0" strokeWidth="10" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#50f49b"
          strokeWidth="10"
          fill="none"
          strokeDasharray="251.2"
          strokeDashoffset="75"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="54" textAnchor="middle" fontSize="20" fill="#50f49b">70%</text>
      </svg>
      <p className="text-[#50f49b] font-medium mt-2">70% of issues resolved</p>
    </div>

    {/* Bullet Point List */}
    <ul className="list-disc pl-6 mt-4 text-[#50f49b]">
      <li>"Eksempel 1"</li>
      <li>"Eksempel 2"</li>
      <li>"Eksempel 3"</li>
      <li>"Eksempel 4"</li>
    </ul>

    <div className="absolute bottom-2 right-2 text-gray-400"><Scaling size={16}/></div>
    <div className="absolute bottom-2 left-2 text-gray-400"><Move size={16}/></div>
  </div>
)}

        </GridLayout>
      </div>
    </LayoutComponent>
  );
}

export default Dashboard;
