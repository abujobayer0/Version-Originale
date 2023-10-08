import axios from "axios";
import CouponTable from "../couponTable/couponCodeTable";
import CouponForm from "../couponCodeForm/couponCodeForm";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { BiRefresh } from "react-icons/bi";
import Loader from "../loader/Loader";

const CouponCodePage = () => {
  const { data, isLoading, refetch } = useGetData("/get-coupons");
  const coupons = !isLoading && data;

  const addCoupon = (couponData) => {
    if (couponData.code.length < 0) {
      return;
    }
    axios
      .post("https://test-originale.onrender.com/add-coupon", couponData)
      .then(() => {})
      .catch((error) => {
        console.error("Error adding coupon:", error);
      });
  };
  if (isLoading) {
    return <Loader />;
  }
  const handleRefresh = () => {
    refetch();
  };
  return (
    <div className="bg-gray-50 p-10 w-full">
      <h1 className="text-black text-2xl font-bold">Coupon Management</h1>
      <CouponForm addCoupon={addCoupon} />
      <div>
        <button
          onClick={handleRefresh}
          className={`text-2xl text-white bg-[#839f9099] p-2 ${
            isLoading && "animate-spin"
          } rounded-full`}
        >
          <BiRefresh />
        </button>
        <CouponTable refetch={refetch} coupons={coupons} />
      </div>
    </div>
  );
};

export default CouponCodePage;
