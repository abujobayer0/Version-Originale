import OrderCreateForm from "../adminOrderCreateFrom/adminOrderCreateForm";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../loader/Loader";
import { useState } from "react";
import OrderDetailModal from "../order_detail_modal/orderDetailModal";
import { FaEye } from "react-icons/fa";
const OrderList = () => {
  const { data: orders, isLoading, refetch } = useGetData("/orders/all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [details, setDetails] = useState([]);
  if (isLoading) {
    return <Loader />;
  }
  function openModal(order) {
    setDetails(order);
    setIsDetailOpen(true);
  }

  const handleStatusChange = (id, current_status) => {
    fetch(`https://test-originale.onrender.com/order/status/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active_status: current_status }),
    })
      .then((response) => {
        if (response.ok) {
          refetch();
        } else {
          console.error("Failed to update status");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="max-w-[95%] bg-gray-50 overflow-hidden">
      <h2 className="text-2xl mt-8 w-full font-semibold px-10 mb-4">
        Product Order List
      </h2>
      <OrderCreateForm />
      <div className="w-full  overflow-x-auto">
        <table className="min-w-full mb-4 bg-gray-50">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                COD/MFS/STRIPE
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Status
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <>
                <tr key={order._id}>
                  <td
                    className="px-2 py-4  whitespace-nowrap"
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      maxHeight: "50px",
                      padding: "0 10px",
                      overflowX: "scroll",
                    }}
                  >
                    <span className="">{order._id}</span>
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap"
                    style={{
                      maxWidth: "50px",
                      overflow: "hidden",
                    }}
                  >
                    {order.transiction_id && "TS_ID #" + order?.transiction_id}

                    <>{order?.method}</>
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap"
                    onClick={() => openModal(order)}
                  >
                    <FaEye />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {order?.order_items?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <img
                          src={item.img || item.productImage[0]}
                          className="w-12 h-12"
                          alt=""
                        />
                      </div>
                    ))}
                  </td>
                  <td
                    className="px-2 py-4 whitespace-nowrap"
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      maxHeight: "50px",
                      padding: "0 10px",
                      overflowX: "scroll",
                    }}
                  >
                    {order?.order_items?.map((orderItem, index) => (
                      <div key={index}>
                        {orderItem?.item?.productName || orderItem?.productName}
                      </div>
                    ))}
                  </td>

                  <td
                    className="px-2 py-4 whitespace-nowrap"
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      maxHeight: "50px",
                      padding: "0 10px",
                      overflowX: "scroll",
                    }}
                  >
                    {order?.order_items[0]?.added_by || order?.email}
                  </td>
                  <td className="px-2 pl-10 py-4 whitespace-nowrap">
                    {order?.order_items?.map((item, index) => (
                      <div key={index} className="mb-2">
                        {item.quantity || order?.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {order?.currency} {order?.totalPrice}
                  </td>

                  <td className="px-2 py-4 whitespace-nowrap">
                    {new Date(order.date).toLocaleString()}
                  </td>
                  <td
                    style={{
                      maxWidth: "40px",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      className={`px-2 h-fit w-full text-black py-4 whitespace-nowrap ${
                        order.active_status === "on processing"
                          ? "bg-green-300"
                          : order.active_status === "packed"
                          ? "bg-yellow-300"
                          : order.active_status === "delivered"
                          ? "bg-green-900 text-white"
                          : order.active_status === "return"
                          ? "bg-red-300"
                          : "bg-orange-300"
                      }`}
                    >
                      {order.active_status}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <select
                      name="status"
                      defaultValue={order.active_status}
                      onChange={(current_status) =>
                        handleStatusChange(
                          order._id,
                          current_status.target.value
                        )
                      }
                    >
                      <option value="on processing">on proccessing</option>
                      <option value="packed">packed</option>
                      <option value="delivered">deliverd</option>
                      <option value="shipped">shipped</option>
                      <option value="return">return</option>
                    </select>
                  </td>
                </tr>
              </>
            ))}
            <OrderDetailModal
              isDetailOpen={isDetailOpen}
              setIsDetailOpen={setIsDetailOpen}
              data={details}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
