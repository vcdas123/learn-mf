import React from "react";
import StudentGradesList from "./pages/List";
import StudentGradesCreate from "./pages/Create";
import StudentGradesDetail from "./pages/Detail";
import StudentGradesEdit from "./pages/Edit";
import StudentGradesDashboard from "./pages/Dashboard";
import StudentGradesStatistics from "./pages/Statistics";

// All paths are RELATIVE (no leading '/')
// These are nested under /student-grades/* (defined by host)
export const routes = [
  { path: "/", component: StudentGradesList }, // Matches /student-grades/
  { path: "dashboard", component: StudentGradesDashboard }, // Matches /student-grades/dashboard
  { path: "statistics", component: StudentGradesStatistics }, // Matches /student-grades/statistics
  { path: "add", component: StudentGradesCreate }, // Matches /student-grades/add
  { path: ":id/edit", component: StudentGradesEdit }, // Matches /student-grades/:id/edit (must come before :id)
  { path: ":id", component: StudentGradesDetail }, // Matches /student-grades/:id
];

export const defaultRoute = "/";
