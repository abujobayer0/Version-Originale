// src/components/CouponForm.js
import { useState } from "react";

const CouponForm = ({ addCoupon }) => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addCoupon({ code, discount });
    } catch (err) {
      console.log(err);
    } finally {
      setCode("");
      setDiscount("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label htmlFor="code" className="block text-gray-700">
          Coupon Code
        </label>
        <input
          type="text"
          id="code"
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:bg-[#839f9099]"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="discount" className="block text-gray-700">
          Discount Percentage
        </label>
        <input
          type="number"
          id="discount"
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:bg-[#839f9099]"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#839f9099] text-white rounded-lg  focus:outline-none"
      >
        Add Coupon
      </button>
    </form>
  );
};

export default CouponForm;
