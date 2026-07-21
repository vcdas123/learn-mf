import React from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Converter } from "./pages/Converter";
import { Karat } from "./pages/Karat";
import { History } from "./pages/History";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/converter" element={<Converter />} />
    <Route path="/karat" element={<Karat />} />
    <Route path="/history" element={<History />} />
  </Routes>
);

export default App;
