import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area,
  Bar,
} from "recharts";
const CurrentMonthsOrders = ({ currentMonth, thisMonth }) => {
  return (
    <div className="flex flex-col  bg-white border-gray-100 border rounded-sm overflow-hidden ">
      <div className="flex items-center">
        <div className="px-4 text-gray-700">
          <h3 className="text-lg font-bold tracking-wider w-full  pt-2 ">
            This Month Orders
          </h3>
          <p className="text-3xl  font-bold p-2 mt-2 text-center bg-gray-100 text-[#839f9099]">
            {
              thisMonth?.last5MonthsOrders[
                thisMonth?.last5MonthsOrders.length - 1
              ]?.orders
            }
          </p>
        </div>
      </div>
      <div className="w-full mt-8 h-60">
        <ResponsiveContainer>
          <ComposedChart
            width={500}
            height={400}
            data={currentMonth?.currentMonthData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue.BDT" // Assuming you want to display BDT revenue
              fill="#839f9099"
              stroke="#839f9099"
            />
            <Bar dataKey="orders" barSize={20} fill="#a1a9a5" />
            <Line
              type="monotone"
              dataKey="revenue.AED" // Assuming you want to display AED revenue
              stroke="#7c81ad"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CurrentMonthsOrders;
