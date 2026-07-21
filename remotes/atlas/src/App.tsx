import React from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Books } from "./pages/Books";
import { Earthquakes } from "./pages/Earthquakes";
import { Subjects } from "./pages/Subjects";
import { NewArrivals } from "./pages/NewArrivals";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/books" element={<Books />} />
    <Route path="/earthquakes" element={<Earthquakes />} />
    <Route path="/subjects" element={<Subjects />} />
    <Route path="/new" element={<NewArrivals />} />
  </Routes>
);

export default App;
