import { useState } from "react";
import { HiZoomOut } from "react-icons/hi";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GoogleAnalyticsApp from "../googleAnalytics/AnalyticsAppGoogle";
import { useAnalyticsData } from "../../context/analyticsContext";

const formatDuration = (value, totalUserVisit) => {
  const devidedValue = value / totalUserVisit;
  const minutes = Math.floor(devidedValue / 60);
  const seconds = Math.round(devidedValue % 60);
  return `${minutes}m ${seconds}s`;
};

const MonthUserVisitAndAverageTimeStay = () => {
  const { analyticsData } = useAnalyticsData();
  const sessionDataRows = analyticsData?.sessionData?.rows || [];
  const responseDataRows = analyticsData?.responseData?.rows || [];
  const totalUserVisit =
    analyticsData?.responseData?.rows[0]?.metricValues[0]?.value;
  const combinedData = sessionDataRows.map((sessionRow) => {
    const day = sessionRow.dimensionValues[0]?.value;
    const averageSessionDuration = parseFloat(
      sessionRow.metricValues[0]?.value || 0
    );

    const active28DayUsersRow = responseDataRows.find(
      (responseRow) => responseRow.dimensionValues[0]?.value === day
    );
    const active28DayUsers = parseInt(
      active28DayUsersRow?.metricValues[0]?.value || 0
    );

    const totalUserVisit =
      analyticsData?.responseData?.rows[0]?.metricValues[0]?.value;
    return {
      day,
      averageSessionDuration: formatDuration(
        averageSessionDuration,
        totalUserVisit
      ),
      active28DayUsers,
    };
  });

  // Convert time to a human-readable format
  const timeInSeconds = parseFloat(
    analyticsData?.sessionData?.rows[0]?.metricValues[0]?.value || 0
  );
  const timeToShow = formatDuration(timeInSeconds, totalUserVisit);

  return (
    <div className="items-center bg-white border border-gray-100 gap-4">
      <div className="w-full bg-white ">
        <div className=" p-3  rounded-lg  text-black">
          <div className="flex items-center justify-between">
            <div className="flex justify-between w-full items-center">
              <div>
                <p className="text-xl font-semibold">This Month User visit</p>
                <p className="text-xl md:text-3xl  font-bold p-2  text-center bg-gray-100 text-[#839f9099]">
                  <span className="font-bold">
                    {analyticsData?.responseData?.rows[0]?.metricValues[0]
                      ?.value || 0}
                  </span>
                  <span className="text-sm">user</span>
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold">Average Time</p>
                <p className="text-xl md:text-3xl  font-bold p-2  text-center bg-gray-100 text-[#839f9099]">
                  <span className="font-bold">{timeToShow}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GoogleAnalyticsApp />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={combinedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis
            yAxisId="left"
            label={{
              value: "Average Session Duration",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Active 28-Day Users",
              angle: -90,
              position: "insideRight",
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="averageSessionDuration"
            stroke="#8884d8"
            name="Average Session Duration"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="active28DayUsers"
            stroke="#82ca9d"
            name="Active 28-Day Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthUserVisitAndAverageTimeStay;
