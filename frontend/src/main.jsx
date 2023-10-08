import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductProvider } from "./context/productContext";
import ContextAPI from "./context/contextAPI";
import { CurrencyProvider } from "./context/CurrencyContext";
import Router from "./Router/Router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnalyticsProvider } from "./context/analyticsContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        "1051604607343-s8riefg3ukvdei8bvmmr3gotgkra4uuj.apps.googleusercontent.com"
      }
    >
      <ContextAPI>
        <CurrencyProvider>
          <AnalyticsProvider>
            <QueryClientProvider client={queryClient}>
              <ProductProvider>
                <App />
                <Router />
              </ProductProvider>
            </QueryClientProvider>
          </AnalyticsProvider>
        </CurrencyProvider>
      </ContextAPI>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
