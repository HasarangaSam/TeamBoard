import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import ClerkSetup from "./components/ClerkSetup.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkSetup>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkSetup>
  </StrictMode>,
);
