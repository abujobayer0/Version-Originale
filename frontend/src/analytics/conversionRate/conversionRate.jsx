import { useEffect, useState } from "react";
import { parseISO, format } from "date-fns";
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
const ConversionRate = ({ orderDatas }) => {
  const [conversionRates, setConversionRates] = useState([]);
  useEffect(() => {
    if (orderDatas && orderDatas.length > 0) {
      // Format all dates to "yyyy-MM" for consistency
      const formattedDates = orderDatas.map((order) => {
        const parsedDate = parseISO(order.date);
        return format(parsedDate, "yyyy-MM");
      });

      // Create an array of the last 6 months, including the current month
      const currentDate = new Date();
      const last6Months = Array.from({ length: 6 }, (_, index) => {
        let month = currentDate.getMonth() - index;
        let year = currentDate.getFullYear();
        if (month < 0) {
          month += 12;
          year -= 1;
        }
        return format(new Date(year, month, 1), "yyyy-MM");
      });

      // Count orders for each month, considering only "delivered" orders
      const monthlyConversionRates = last6Months.map((month) => {
        const ordersInMonth = formattedDates.filter((date, index) => {
          return (
            date === month && orderDatas[index].active_status === "delivered"
          );
        });

        const totalOrders = ordersInMonth.length;
        const successfulOrders = ordersInMonth.filter(
          (date, index) => orderDatas[index].active_status === "delivered"
        ).length;

        const rate =
          totalOrders === 0 ? 0 : (successfulOrders / totalOrders) * 100;

        return { name: month, conversionRate: rate.toFixed(2) };
      });

      setConversionRates(monthlyConversionRates);
    }
  }, [orderDatas]);

  return (
    <div className="w-full flex bg-white border border-gray-100 rounded-sm overflow-hidden flex-col">
      <div className="flex items-center">
        <div className="px-4 text-gray-700">
          <h3 className="text-lg font-bold tracking-wider w-full pt-2">
            Conversion Rate
          </h3>
          <span className="flex gap-2">
            <p className="text-xl md:text-3xl font-bold p-2 mt-2 text-center bg-gray-100 text-[#839f9099]">
              <span className="font-bold">
                {conversionRates.length > 0
                  ? conversionRates[0].conversionRate
                  : "N/A"}
              </span>
              <span className="text-sm">%</span>
            </p>
          </span>
        </div>
      </div>
      <div className="w-full mt-8 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            layout="horizontal"
            width={500}
            height={300}
            data={conversionRates}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line dataKey="conversionRate" stroke="#7C81AD" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversionRate;
