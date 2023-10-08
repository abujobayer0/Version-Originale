import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const TotalOrders = ({ thisMonth, totalOrders }) => {
  return (
    <div className="w-full  p-2 bg-white border border-gray-100 rounded-sm overflow-hidden  flex flex-col">
      <div className="flex items-center ">
        <div className="px-4 text-gray-700">
          <h3 className="text-lg font-bold tracking-wider w-full  pt-2 ">
            Total Order
          </h3>
          <p className="text-3xl  font-bold p-2 mt-2 text-center bg-gray-100 text-[#839f9099]">
            {totalOrders?.result}
          </p>
        </div>
      </div>
      <div className="w-full mt-8 h-60">
        <ResponsiveContainer>
          <AreaChart
            data={thisMonth?.last5MonthsOrders}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#839f9099"
              fill="#839f9099"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalOrders;
