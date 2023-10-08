import React, { useEffect, useState } from "react";
import Loader from "../loader/Loader";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import TotalOrders from "../../analytics/totalOrder/totalOrders";
import Revenue from "../../analytics/revenue/revenue";
import CurrentMonthRevenue from "../../analytics/currentMonthRevenue/currentMonthRevenue";
import CurrentMonthsOrders from "../../analytics/currentMonthOrders/currentMonthsOrders";
import ReturningCustomers from "../../analytics/reterningCustomer/returningCustomer";
import AverageOrderValue from "../../analytics/averageOrderValue/averageOrderValue";
import TotalStocks from "../../analytics/totalStocks/totalStocks";
import MonthUserVisitAndAverageTimeStay from "../../analytics/monthUserVisitAndAverageTimeStay/monthUserVisitAndAverageTimeStay";
import GoogleAnalytics, {
  InitializeGoogleAnalytics,
} from "../../analytics/googleAnalytics/googleAnalytics";
import GoogleAnalyticsApp from "../../analytics/googleAnalytics/AnalyticsAppGoogle";
import ConversionRate from "../../analytics/conversionRate/conversionRate";

const Dashboard = () => {
  const { data: totalOrders, isLoading: orderLoading } = useGetData(
    "/total/orders"
  );
  const [state, setState] = useState([]);
  const { data: customers } = useGetData("/returning");
  const { data: currentMonth, isLoading: revenueLoading } = useGetData(
    "/data/current-month/each-day"
  );
  const { data: totalRevenue } = useGetData("/revenue/admin");
  const { data: thisMonth, isLoading: thisMonthLoading } = useGetData(
    "/orders/current-month"
  );

  useEffect(() => {
    fetch("https://test-originale.onrender.com/order/customer/az")
      .then((res) => res.json())
      .then((data) => setState(data));
  }, []);
  console.log(state);
  if (orderLoading || revenueLoading || thisMonthLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full py-6 bg-gray-50   min-h-screen">
      <div className="grid w-full grid-cols-1 xl:scrollable-container gap-4 px-4  md:grid-cols-2 xl:grid-cols-3 sm:px-8">
        <MonthUserVisitAndAverageTimeStay />
        <div className="xl:col-span-2">
          <ConversionRate orderDatas={state} />
        </div>
        <TotalOrders totalOrders={totalOrders} thisMonth={thisMonth} />
        <div className="xl:col-span-2">
          <Revenue thisMonth={thisMonth} totalRevenue={totalRevenue} />
        </div>
        <div className="xl:col-span-2">
          <CurrentMonthRevenue
            currentMonth={currentMonth}
            thisMonth={thisMonth}
          />
        </div>
        <AverageOrderValue thisMonth={thisMonth} />
        <div className="xl:col-span-1">
          <ReturningCustomers customers={state} />
        </div>
        <div className="xl:col-span-2">
          <CurrentMonthsOrders
            currentMonth={currentMonth}
            thisMonth={thisMonth}
          />
        </div>
        <div className="xl:col-span-3">
          <TotalStocks />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
