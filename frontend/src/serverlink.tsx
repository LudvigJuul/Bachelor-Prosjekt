// import { useEffect, useState } from "react";

// type ApiRespone = {
//   name: string;
//   version: String;
// }

// function serverLink() {
//   const [data, setData] = useState<ApiRespone | null>(null);

//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/api/data")
//       .then((response) => response.json())
//       .then((data : ApiRespone) => setData(data));
//   }, []);

//   return (
//     <div>
//       <h1>Flask + React</h1>
//       {data ? <p>{data.name} - v{data.version}</p> : <p>Laster data...</p>}
//     </div>
//   );
// }

// export default serverLink;
