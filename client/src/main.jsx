// client/src/main.jsx

// Initializes the React application and mounts the root component.
// Loads the global stylesheet before rendering the application.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

// Mount the application into the root HTML element.
const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
