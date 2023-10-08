import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { subMonths, format, isSameMonth } from "date-fns";

const ReturningCustomers = ({ customers }) => {
  const totalCustomers = customers.map((i) => {
    return {
      email: i.email,
      month: new Date(i.date).getMonth() + 1,
      year: new Date(i.date).getFullYear(),
    };
  });

  const thisDate = new Date();
  const currentMonth = thisDate.getMonth() + 1;
  const currentYear = thisDate.getFullYear();

  const last5MonthsData = [];
  const monthLabels = [];

  for (let i = 0; i < 5; i++) {
    // Calculate the year and month for the current iteration
    let year = currentYear;
    let month = currentMonth - i;

    if (month <= 0) {
      // Adjust for previous year if month is negative
      year -= 1;
      month += 12;
    }

    monthLabels.unshift(`${month}/${year}`);

    // Filter customers for the current month
    const currentMonthCustomers = totalCustomers.filter((user) => {
      return user.month === month && user.year === year;
    });

    // Filter customers for the previous month
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;
    const previousMonthCustomers = totalCustomers.filter((user) => {
      return user.month === previousMonth && user.year === previousYear;
    });

    // Calculate new and returning customers
    let newCustomers = 0;
    let returningCustomers = 0;

    // Create a Set to keep track of unique emails in the current month
    const uniqueEmails = new Set();

    currentMonthCustomers.forEach((customer) => {
      if (!uniqueEmails.has(customer.email)) {
        uniqueEmails.add(customer.email);

        // Check if the email is in the previous month's customers
        if (
          previousMonthCustomers.some(
            (prevCustomer) => prevCustomer.email === customer.email
          )
        ) {
          returningCustomers++;
        } else {
          newCustomers++;
        }
      }
    });

    last5MonthsData.unshift({
      name: `${month}/${year}`,
      newCustomers,
      returningCustomers,
    });
  }
  return (
    <div className="flex w-full  bg-white border border-gray-100 rounded-sm overflow-hidden flex-col">
      <div className="flex items-center">
        <div className="px-4 text-gray-700">
          <h3 className="text-lg font-bold tracking-wider w-full pt-2">
            Returning Customers
          </h3>
          <span className="flex gap-2">
            <p className="text-xl md:text-3xl  font-bold p-2 mt-2 text-center bg-gray-100 text-[#7C81AD] ">
              <span className="font-bold">
                {last5MonthsData?.length > 0
                  ? last5MonthsData[last5MonthsData.length - 1].newCustomers
                  : 0}
              </span>
              <span className="text-sm"> New Customers</span>
            </p>
            <p className="text-xl md:text-3xl  font-bold p-2 mt-2 text-center bg-gray-100 text-[#839f9099]">
              <span className="font-bold">
                {last5MonthsData?.length > 0
                  ? last5MonthsData[last5MonthsData.length - 1]
                      .returningCustomers
                  : 0}
              </span>
              <span className="text-sm">Returning Customers</span>
            </p>
          </span>
        </div>
      </div>
      <div className="w-full mt-8 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={730}
            height={250}
            data={last5MonthsData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b0c1b8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#b0c1b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="newCustomers"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="returningCustomers"
              stroke="#b0c1b8"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReturningCustomers;
