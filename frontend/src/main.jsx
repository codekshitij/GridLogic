import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // Ensure Tailwind is imported here

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Since F1 telemetry doesn't change after a race is over,
      // we can set a long stale time to avoid unnecessary refetches.
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
