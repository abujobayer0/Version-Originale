import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { HiLogin, HiRefresh } from "react-icons/hi";
import { useAnalyticsData } from "../../context/analyticsContext";

const GoogleAnalyticsApp = () => {
  const propertyId = 408286583;
  const [popup, setPopup] = useState(false);

  const { setAnalyticsData, setIsPopup, isPopup } = useAnalyticsData();
  const googleLogin = useGoogleLogin({
    clientId:
      "1051604607343-s8riefg3ukvdei8bvmmr3gotgkra4uuj.apps.googleusercontent.com",
    responseType: "token",
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse?.access_token;
      if (accessToken) {
        fetchData(accessToken);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const fetchData = async (accessToken) => {
    try {
      const requestBody = {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "day" }],
        metrics: [
          {
            name: "active28DayUsers",
          },
        ],
      };
      const requestBody1 = {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "day" }],
        metrics: [
          {
            name: "userEngagementDuration",
          },
        ],
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const averageSessionTimeResponse = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        requestBody1,
        { headers }
      );

      const apiResponse = await axios.post(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        requestBody,
        { headers }
      );
      const sessionData = averageSessionTimeResponse.data;
      const responseData = apiResponse.data;

      const data = { sessionData, responseData };
      setAnalyticsData(data);
      setIsPopup(true);
    } catch (error) {
      console.error(error);
    }
  };
  const refreshData = () => {
    if (googleLogin.tokenResponse?.access_token) {
      fetchData(googleLogin.tokenResponse.access_token);
    }
  };

  useEffect(() => {
    if (!isPopup) {
      googleLogin();
    }
  }, []);

  useEffect(() => {
    refreshData();
    const refreshInterval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, [googleLogin.tokenResponse]);

  return <div></div>;
};

export default GoogleAnalyticsApp;
