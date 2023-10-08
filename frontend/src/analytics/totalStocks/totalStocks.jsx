import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Bar,
  Legend,
  BarChart,
} from "recharts";
import { useGetData } from "../../customHooks/useGetData/useGetData";
const renderCustomizedLabel = (props) => {
  const { x, y, width, value } = props;
  const radius = 10;
  return (
    <g>
      <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value.split(" ")[1]}
      </text>
    </g>
  );
};
const TotalStocks = () => {
  const { data: stocksInfo, isLoading } = useGetData("/categories");
  const chartData = stocksInfo?.map((item) => ({
    name: item.category,
    totalProducts: item.totalProducts,
    totalSubCategory: item.subCategory.length,
  }));
  const totalProducts = chartData?.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.totalProducts;
  }, 0);
  if (isLoading) {
    return;
  }

  return (
    <div className="flex w-full   bg-white border border-gray-100 rounded-sm overflow-hidden flex-col">
      <div className="flex items-center">
        <div className="px-4 text-gray-700">
          <h3 className="text-lg font-bold tracking-wider w-full  pt-2 ">
            Total Products
          </h3>
          <span className="flex gap-2">
            <p className="text-xl md:text-3xl  font-bold p-2 mt-2 text-center bg-gray-100 text-[#7C81AD]">
              <span className="font-bold">{totalProducts}</span>
            </p>
          </span>
        </div>
      </div>
      <div className="w-full mt-8 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSubCategory" fill="#8884d8" minPointSize={5}>
              <LabelList dataKey="name" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="totalProducts" fill="#b0c1b8" minPointSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalStocks;
