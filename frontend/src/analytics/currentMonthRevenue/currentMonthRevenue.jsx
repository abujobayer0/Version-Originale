import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const CurrentMonthRevenue = ({ currentMonth, thisMonth }) => {
  return (
    <div className="w-full flex  bg-white border border-gray-100 rounded-sm overflow-hidden  flex-col">
      <div className="flex items-center ">
        <div className="px-4 text-gray-700">
          <h3 className="text-lg font-bold tracking-wider w-full  pt-2 ">
            This Month Earning
          </h3>
          <span className="flex gap-2">
            <p className="text-xl md:text-3xl  font-bold p-2 mt-2 text-center bg-gray-100 text-[#839f9099]">
              <span className="font-bold">
                {thisMonth?.totalRevenue?.AED?.toFixed(2)}
              </span>{" "}
              <span className="text-sm">AED</span>
            </p>
            <p className="text-xl md:text-3xl  font-bold p-2 mt-2 text-center bg-gray-100 text-[#7C81AD]">
              <span className="font-bold">
                {thisMonth?.totalRevenue?.BDT?.toFixed(2)}
              </span>{" "}
              <span className="text-sm">BDT </span>
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
            data={currentMonth?.currentMonthData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" />
            <YAxis type="number" />
            <Tooltip />
            <Legend />
            <Line dataKey="revenue.BDT" stroke="#7C81AD" />
            <Line dataKey="revenue.AED" stroke="#839f9099" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CurrentMonthRevenue;
