import "./lib/dayjs";

//css
import "./styles/global.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
//components
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";

export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
