import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const AverageOrderValue = ({ thisMonth }) => {
  const data = thisMonth?.last5MonthsOrders?.map((monthData) => {
    const AverageBDT =
      monthData.orders !== 0
        ? isFinite(monthData.revenue.BDT / monthData.thisMonthBDTOrder)
          ? monthData.revenue.BDT / monthData.thisMonthBDTOrder
          : 0
        : 0;
    const AverageAED =
      monthData.orders !== 0
        ? isFinite(monthData.revenue.AED / monthData.thisMonthAEDOrder)
          ? monthData.revenue.AED / monthData.thisMonthAEDOrder
          : 0
        : 0;
    return {
      name: monthData.name,
      AverageBDT,
      AverageAED,
    };
  });

  return (
    <div className="flex w-full  bg-white border border-gray-100 rounded-sm overflow-hidden flex-col">
      <div className="flex items-center">
        <div className="px-4 text-gray-700">
          <h3 className="text-lg font-bold tracking-wider w-full pt-2 ">
            Average Order Value
          </h3>
          <span className="flex gap-2">
            <p className="text-xl md:text-3xl font-bold p-2 mt-2 text-center bg-gray-100 text-[#839f9099]">
              <span className="font-bold">
                {!isNaN(
                  thisMonth?.last5MonthsOrders[
                    thisMonth?.last5MonthsOrders.length - 1
                  ]?.thisMonthAEDOrder
                ) &&
                thisMonth?.last5MonthsOrders[
                  thisMonth?.last5MonthsOrders.length - 1
                ]?.thisMonthAEDOrder !== 0
                  ? (
                      thisMonth?.last5MonthsOrders[
                        thisMonth?.last5MonthsOrders.length - 1
                      ]?.revenue?.AED /
                      thisMonth?.last5MonthsOrders[
                        thisMonth?.last5MonthsOrders.length - 1
                      ]?.thisMonthAEDOrder
                    ).toFixed(2)
                  : "N/A"}
              </span>
              <span className="text-sm"> AED</span>
            </p>
            <p className="text-xl md:text-3xl font-bold p-2 mt-2 text-center bg-gray-100 text-[#7C81AD]">
              <span className="font-bold">
                {(
                  thisMonth?.last5MonthsOrders[
                    thisMonth?.last5MonthsOrders?.length - 1
                  ]?.revenue?.BDT /
                  thisMonth?.last5MonthsOrders[
                    thisMonth?.last5MonthsOrders?.length - 1
                  ]?.thisMonthBDTOrder
                )?.toFixed(2)}
              </span>
              <span className="text-sm"> BDT</span>
            </p>
          </span>
        </div>
      </div>
      <div className="w-full mt-8 h-60">
        <ResponsiveContainer width="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid vertical={false} strokeDashArray="3 3" />
            <Tooltip
              wrapperStyle={{ backgroundColor: "red" }}
              labelStyle={{ color: "#000" }}
              itemStyle={{ color: "#b0c1b8" }}
              formatter={(value) => `${value.toFixed(2)}`}
              labelFormatter={(value) => `Month: ${value}`}
            />
            <Area
              type="monotone"
              dataKey="AverageBDT"
              stroke="#8884d8"
              fill="url(#colorValue)"
            />
            <Area
              type="monotone"
              dataKey="AverageAED"
              stroke="#82ca9d"
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageOrderValue;
