import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/code-highlight.css";
import { App } from "./components/App.js";
import { ThemeProvider } from "./components/theme-provider.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="ursanotes-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
