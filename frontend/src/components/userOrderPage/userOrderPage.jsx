import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserOrderPage = () => {
  const { email } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`https://test-originale.onrender.com/order/user/${email}`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [email]);

  return (
    <div className="container  mx-auto max-w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Order Data Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apartment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discounted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Postal Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.active_status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.apartment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.country}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.discounted.toString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.method}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.postalCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.state}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.status.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.totalPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrderPage;
