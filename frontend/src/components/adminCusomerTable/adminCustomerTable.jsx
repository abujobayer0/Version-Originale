import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";
const AdminCustomerTable = () => {
  const { data: customers, isLoading } = useGetData("/customers");
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl w-full font-semibold px-10 mb-4">
        Customer List
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={
                      customer.image ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                    }
                    alt={customer?.name}
                    className="w-8 h-8 rounded-full"
                    loading="lazy"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.name ||
                    customer.firstName + " " + customer.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/admin/order/user/${customer?.email}`}>
                    {customer.email}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(customer.joinedDate).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomerTable;
