import React from "react";
import ActivityLogList from "./pages/List";
import ActivityLogDetail from "./pages/Detail";
import ActivityLogCreate from "./pages/Create";
import ActivityLogEdit from "./pages/Edit";

export const routes = [
  { path: "/", component: ActivityLogList },
  { path: "add", component: ActivityLogCreate },
  { path: ":id/edit", component: ActivityLogEdit },
  { path: ":id", component: ActivityLogDetail },
];

export const defaultRoute = "/";
