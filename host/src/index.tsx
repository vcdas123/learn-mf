import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import "./styles/globals.css";

// EXACTLY ONE createRoot() call - ONLY in host
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {/* EXACTLY ONE BrowserRouter - remotes inherit this context */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
