import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BaseReport } from "@/components/reports/BaseReport";
import "@/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="min-h-screen bg-background">
      <BaseReport />
    </main>
  </StrictMode>,
);
