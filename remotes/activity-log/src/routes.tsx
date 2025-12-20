import React from "react";
import LogSheetList from "./pages/List";
import LogSheetDetail from "./pages/Detail";

export const routes = [
  { path: "/", component: LogSheetList },
  { path: ":id", component: LogSheetDetail },
];

export const defaultRoute = "/";
