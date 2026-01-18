import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initMockApi } from "./services/mockApi";

// Initialize mock API for development
initMockApi();

createRoot(document.getElementById("root")!).render(<App />);
