import React from "react";
import { Routes, Route } from "react-router-dom";
import { Gallery } from "./pages/Gallery";
import { Detail } from "./pages/Detail";
import { MarsRover } from "./pages/MarsRover";
import { EpicImagery } from "./pages/EpicImagery";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Gallery />} />
    <Route path="/apod/:date" element={<Detail />} />
    <Route path="/mars" element={<MarsRover />} />
    <Route path="/epic" element={<EpicImagery />} />
  </Routes>
);

export default App;
