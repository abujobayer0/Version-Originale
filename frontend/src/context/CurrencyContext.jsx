// CurrencyContext.js

import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem("selectedCurrency") || "AED"
  );
  const [isValid, setIsValid] = useState(
    localStorage.getItem("valid") === "true" || true
  );
  const [locationLoading, setLocationLoading] = useState(true);

  const fetchDataAndNavigate = async () => {
    try {
      const ipResponse = await fetch(
        "https://test-originale.onrender.com/location"
      );
      const ipJson = await ipResponse.json();
      const locationResponse = await fetch(
        `https://ipinfo.io/${ipJson?.ip}?token=f2ae0abd658bf6`
      );
      const locationJson = await locationResponse.json();

      if (!locationJson.status) {
        if (locationJson.country === "BD" || locationJson.country === "AE") {
          setSelectedCurrency(locationJson.country === "BD" ? "BDT" : "AED");
          setIsValid(true);
        } else {
          setSelectedCurrency("AED");
          setIsValid(false);
        }
      }

      setLocationLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAndNavigate();
  }, []);
  return (
    <CurrencyContext.Provider
      value={{ selectedCurrency, isValid, locationLoading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
