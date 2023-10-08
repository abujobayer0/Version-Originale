import { useState } from "react";
import UserPanelSidebar from "../../components/userPanelSidebar/userPanelSidebar";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../../components/loader/Loader";
import Invoice from "../../components/invoice/invoice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BiUserCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
const auth = getAuth(app);

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [status, setStatus] = useState("");
  const { data: orders, isLoading } = useGetData(`/order?email=${user?.email}`);
  const handleSearchStatus = (e) => {
    setStatus(e);
    const find = orders?.find((i) => i._id === e);
    if (!find) {
      return setStatus("Not Found");
    }
    const status = find?.active_status;
    setStatus(status);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="container px-6 lg:px-[6rem] xl:px-[12rem] pt-[2.13rem] pb-[3rem] flex flex-col justify-between lg:pt-[5.19rem] lg:pb-[4.35rem]">
      <div className="flex items-center justify-between mb-[2.3rem]">
        <h2 className="text-[#fff] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide md:text-[1.11rem] mx-auto text-center">
          My Orders
        </h2>
        <Link to={"/user/profile"}>
          <button className="text-2xl relative p-4 bg-[#CED4CD] rounded-full">
            <BiUserCircle />
            <span className=" inline-block border w-4 absolute mt-1 right-0 top-8 bg-green-600 animate-pulse rounded-full h-4  "></span>
          </button>
        </Link>
      </div>
      <div className="w-full flex flex-col  gap-6 items-start justify-between  ">
        <div className="w-full ">
          <div className="mx-auto w-full">
            <div className="max-w-full overflow-x-auto">
              <table className="min-w-full oborder-collapse table-auto">
                <thead>
                  <tr>
                    <th className="euroWide md:text-[1.11rem] bg-[#CED4CD] px-2 h-[4rem]">
                      Image
                    </th>
                    <th className="euroWide md:text-[1.11rem] bg-[#CED4CD] px-2 h-[4rem] whitespace-nowrap">
                      Order ID
                    </th>
                    <th className="euroWide md:text-[1.11rem] bg-[#CED4CD] px-2 h-[4rem] whitespace-nowrap">
                      Order Name
                    </th>
                    <th className="euroWide md:text-[1.11rem] bg-[#CED4CD] px-2 h-[4rem]">
                      Quantity
                    </th>
                    <th className="euroWide md:text-[1.11rem] bg-[#CED4CD] px-2 h-[4rem]">
                      Size
                    </th>
                    <th className="euroWide md:text-[1.11rem] bg-[#CED4CD] px-2 h-[4rem]">
                      Color
                    </th>
                    <th className="euroWide md:text-[1.11rem] bg-[#CED4CD] px-2 h-[4rem]">
                      Price
                    </th>
                    <th className="euroWide md:text-[1.11rem] px-2 h-[4rem] bg-[#CED4CD]">
                      Status
                    </th>
                    <th className="euroWide md:text-[1.11rem] px-2 h-[4rem] bg-[#CED4CD]">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order, index) => (
                    <tr key={index}>
                      <td className="p-2 text-white">
                        {order?.order_items?.map((item, index) => (
                          <div key={index} className="mb-2">
                            <img
                              src={item?.img || item?.productImage[0]}
                              className="w-12 h-12"
                              alt=""
                            />
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-white text-center courierNew">
                        <span className="w-12 overflow-hidden">
                          #{order?._id}
                        </span>
                      </td>
                      <td className="p-2 text-white text-center courierNew">
                        {order?.order_items?.map((orderItem, index) => (
                          <div key={index}>
                            {orderItem?.item?.productName ||
                              orderItem?.productName}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-white text-center courierNew">
                        {order?.order_items?.map((item, index) => (
                          <div key={index} className="mb-2">
                            {item?.quantity || order?.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-white text-center courierNew">
                        {order?.order_items?.map((item, index) => (
                          <div key={index} className="mb-2">
                            {item?.size || order?.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-white text-center courierNew">
                        {order?.order_items?.map((item, index) => (
                          <div key={index} className="mb-2">
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                background: `${item?.color}`,
                                color: `${item?.color}`,
                                borderRadius: 50,
                                padding: 2,
                              }}
                            >
                              {" .. "}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="p-2 text-white text-center courierNew">
                        {order?.currency === "BDT" && "BDT"}
                        {order?.currency === "AED" && "AED"}-
                        {order?.totalPrice?.toFixed(2)}
                      </td>
                      <td
                        className={`p-2  font-bold courierNew bg-[#CED4CD] text-black text-center`}
                      >
                        {order?.active_status}
                      </td>
                      <td
                        className={`p-2  font-bold courierNew hover:bg-[#CED4CD] text-black text-center`}
                      >
                        <PDFDownloadLink
                          document={<Invoice invoiceData={order} />}
                          fileName="invoice.pdf"
                        >
                          {({ loading }) =>
                            loading ? (
                              "Loading document..."
                            ) : (
                              <div>
                                <span className="text-white text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none">
                                  Invoice!
                                </span>
                              </div>
                            )
                          }
                        </PDFDownloadLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <UserPanelSidebar
          orders={orders}
          status={status}
          handleSearchStatus={handleSearchStatus}
        />
      </div>
    </div>
  );
};

export default UserProfile;
