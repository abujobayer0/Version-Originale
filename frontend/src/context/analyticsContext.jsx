import React, { createContext, useContext, useState } from "react";

// Create the context
const AnalyticsContext = createContext();

// Create a custom hook to access the context
export const useAnalyticsData = () => {
  return useContext(AnalyticsContext);
};

// Create a context provider component
export const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isPopup, setIsPopup] = useState(false);

  return (
    <AnalyticsContext.Provider
      value={{ analyticsData, isPopup, setIsPopup, setAnalyticsData }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
