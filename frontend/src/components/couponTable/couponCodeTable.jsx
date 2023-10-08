import Swal from "sweetalert2";
const CouponTable = ({ coupons, refetch }) => {
  const handleExpired = (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Expired it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://test-originale.onrender.com/expired/coupon/${e}`, {
          method: "PUT",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              Swal.fire("Coupon expired!", "", "success");
              refetch();
            }
          });
      }
    });
  };
  return (
    <table className="min-w-full mt-4  divide-y divide-gray-200 shadow-md">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className=" py-3 text-left pl-6 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Code
          </th>
          <th
            scope="col"
            className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Discount
          </th>
          <th
            scope="col"
            className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Validity
          </th>
          <th
            scope="col"
            className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {coupons?.map((coupon) => (
          <tr key={coupon.code}>
            <td className=" pl-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {coupon.code}
              </div>
            </td>
            <td className=" py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{coupon.discount}%</div>
            </td>
            <td className=" py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {coupon.validity ? "Valid" : "Expired"}
              </div>
            </td>
            {coupon.validity ? (
              <td className=" py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <button
                    onClick={() => handleExpired(coupon._id)}
                    className="bg-red-500 p-2 text-white"
                  >
                    Click to Expired
                  </button>
                </div>
              </td>
            ) : (
              <td className=" py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <button className="bg-gray-500 cursor-not-allowed p-2 text-white">
                    Expired
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CouponTable;
