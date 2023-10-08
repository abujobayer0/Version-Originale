import { useEffect, useState } from "react";
import { FaStripe } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebase.config";
import Loader from "../../components/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/payment/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import PaymentSuccessPopup from "../../components/paymentSuccessPopup/paymentSuccessPopup";
import { useCurrency } from "../../context/CurrencyContext";
const stripePromise = loadStripe(
  "pk_test_51NqcirHz9IynMNXvQhCWW57XDZi4UeRTKJhUAdUPpkZTARNiwPwDBwHg1Bu2LbEShb59FOs3VViIrOXzYYiygUqt002asLcZJr"
);
const auth = getAuth(app);
const Checkout = () => {
  const [user] = useAuthState(auth);
  const [couponCode, setCouponCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotal, setSubTotal] = useState(0);
  const [discounted, setDiscounted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [apartment, setApartment] = useState("");
  const [method, setMethod] = useState("COD");
  const [userInfo, setUserInfo] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { data: products, isLoading, refetch } = useGetData(
    `/cart/item?email=${user?.email}`
  );
  const { selectedCurrency } = useCurrency();

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  const navigate = useNavigate();
  const [stripePaymentSuccess, setStripeSuccess] = useState(false);

  const cartIncrementCount = (e) => {
    const uri = `https://test-originale.onrender.com/cart/increase/${e}`;
    fetch(uri, { method: "PUT" })
      .then((res) => res.json())
      .then((data) => refetch());
  };

  const cartDecrementCount = (e) => {
    const uri = `https://test-originale.onrender.com/cart/decrease/${e}`;
    fetch(uri, { method: "PUT" })
      .then((res) => res.json())
      .then((data) => refetch());
  };

  const calculateTotalPrice = () => {
    let total = 0;

    if (products && Array.isArray(products)) {
      total = products.reduce((accumulator, item) => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);

        if (!isNaN(price) && !isNaN(quantity)) {
          const subtotal = price * quantity;
          return accumulator + subtotal;
        }

        return accumulator;
      }, 0);
    }
    setSubTotal(total);

    const taxPercentage = 15;
    const shippingFee = selectedCurrency === "BDT" ? 80 : 10;

    const taxAmount = (total * taxPercentage) / 100;
    total += taxAmount + shippingFee;

    setTotalPrice(total);
  };

  const removeProduct = (e) => {
    const uri = `https://test-originale.onrender.com/cart/delete/${e}`;
    fetch(uri, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        refetch();
      });
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };
  const handleMethod = (e) => {
    setMethod(e);
  };
  const applyCouponCode = () => {
    fetch(`https://test-originale.onrender.com/coupon?code=${couponCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          const discountPercentage = parseFloat(data.data.discount) || 0;
          const discountAmount = subtotal * (discountPercentage / 100);
          const discountedSubtotal = subtotal - discountAmount;
          const taxPercentage = 15;
          const shippingFee = selectedCurrency === "BDT" ? 80 : 10;
          const taxAmount = (discountedSubtotal * taxPercentage) / 100;
          const totalWithDiscount =
            discountedSubtotal + taxAmount + shippingFee;

          setTotalPrice(totalWithDiscount);
          setCouponCode("");
          setDiscounted(true);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error applying coupon code:", error);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!products) {
      return toast.warn("You dont have any product for checkout");
    }
    if (products?.length > 0) {
      const payment_info = {
        method: "COD",
        address: address,
        apartment: apartment,
        city: city,
        country: country,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: user?.email,
        totalPrice: totalPrice,
        currency: products[0]?.currency,
        state: state,
        postalCode: postalCode,
        order_items: products,
        date: new Date(),
        discounted: discounted,
        active_status: "on processing",
        status: ["packed", "on processing", "delivered", "return", "shipped"],
      };
      const backup_user_data = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        apartment: apartment,
        city: city,
        country: country,
        phone: phone,
        email: user?.email,
        postalCode: postalCode,
        state: state,
      };

      try {
        const response = await fetch(
          `https://test-originale.onrender.com/custom/order?email=${user?.email}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ payment_info }),
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.acknowledged) {
          // toast.success("Order Placed");
          setPaymentSuccess(true);

          refetch();
        }

        const userBackupInfoResponse = await fetch(
          "https://test-originale.onrender.com/user/info",
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ backup_user_data }),
          }
        );

        if (!userBackupInfoResponse.ok) {
          throw new Error(
            `User backup info request failed with status ${userBackupInfoResponse.status}`
          );
        }

        const userBackupInfoData = await userBackupInfoResponse.json();
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleStripePaymentSuccess = () => {
    setStripeSuccess(true);
  };
  const handlePaymentOk = () => {
    navigate("/user/panel");
  };
  const handlePrevAddressSet = () => {
    setFirstName(userInfo[0]?.backup_user_data.firstName);
    setLastName(userInfo[0]?.backup_user_data.lastName);
    setAddress(userInfo[0]?.backup_user_data.address);
    setApartment(userInfo[0]?.backup_user_data.apartment);
    setCity(userInfo[0]?.backup_user_data.city);
    setCountry(userInfo[0]?.backup_user_data.country);
    setState(userInfo[0]?.backup_user_data.state);
    setPostalCode(userInfo[0]?.backup_user_data.postalCode);
    setPhone(userInfo[0]?.backup_user_data.phone);
  };
  useEffect(() => {
    calculateTotalPrice();
  }, [products]);

  useEffect(() => {
    fetch(`https://test-originale.onrender.com/user/info?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setUserInfo(data));
  }, []);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
      <ToastContainer />
      {paymentSuccess && (
        <PaymentSuccessPopup
          title={"Order Placed."}
          para={
            "Your Order has been confirmed. We’ve sent you an email with all of the details of your order."
          }
          handlePaymentOk={handlePaymentOk}
        />
      )}
      {stripePaymentSuccess && (
        <PaymentSuccessPopup
          title={"Payment successful"}
          para={
            "Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order."
          }
          handlePaymentOk={handlePaymentOk}
        />
      )}
      {method === "COD" && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl lg:max-w-none"
        >
          <h1 className="sr-only">Checkout</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <button
                type="button"
                onClick={() => handleMethod("stripe")}
                className={`flex w-full items-center justify-center rounded-md border  py-2 text-white bg-[#38453e] border-[#9CA3AF]`}
              >
                <span className="sr-only">Pay with Stripe</span>
                <FaStripe size={30} className="w-16" aria-hidden="true" />
              </button>

              <div className="relative mt-8">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t-2 border-[#9CA3AF]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#38453e] text-white px-4 text-sm font-medium ">
                    or
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleMethod("COD")}
                className={`flex w-full font-semibold mt-8 items-center justify-center rounded-md border mb-8  text-white py-3 bg-[#38453e] border-[#9CA3AF] `}
              >
                <span className="sr-only">Cash on delivery</span>
                Cash on delivery
              </button>
              <div className="border-t border-gray-200 pt-10">
                <h2 className="text-[#f3f3f3] courierNew text-[1.25rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase">
                  Shipping information
                </h2>
                {userInfo.length > 0 && (
                  <p
                    onClick={handlePrevAddressSet}
                    className="underline text-white cursor-pointer courierNew mt-4"
                  >
                    Use Previous Information
                  </p>
                )}
                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="first-name"
                        name="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent outline-none mt-[0.88rem]`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]`}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        autoComplete="street-address"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="apartment"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Apartment, suite, etc.
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="apartment"
                        id="apartment"
                        required
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]  `}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        autoComplete="address-level2"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]  `}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        name="gender"
                        id="gender"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="flex justify-between items-center w-full h-[4rem] text-white text-opacity-[0.42] px-[1.5rem] text-[0.95rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-[#38453e] courierNew gap-[0.63rem] border-2 border-[#9CA3AF] appearance-none outline-none "
                      >
                        <option value="">Select</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="UAE">United State Emirates</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="region"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        autoComplete="address-level1"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        autoComplete="postal-code"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        required
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <h2 className="text-[#f3f3f3] euroWide text-[1.06rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                Order summary
              </h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-transparent shadow-xl">
                <h3 className="sr-only">Items in your cart</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {products?.map((product) => (
                    <li key={product._id} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          src={product.img}
                          alt={product?.item?.productName}
                          className="w-20 rounded-md"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <a
                                href={product?.href}
                                className="font-medium text-white "
                              >
                                {product?.item?.productName}
                              </a>
                            </h4>
                            <div className="flex items-center gap-2 text-[#f3f3f3] courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem] mt-2">
                              Color:
                              <span
                                style={{
                                  backgroundColor: product.color,
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                }}
                              ></span>
                            </div>
                            <p className="mt-1 courierNew text-[0.88rem] text-white font-bold leading-[77.5%] tracking-[0.012rem]">
                              Size: {product.size}
                            </p>
                          </div>

                          <div className="ml-4 flow-root text-white flex-shrink-0">
                            <span
                              onClick={() => removeProduct(product._id)}
                              className="-m-2.5 cursor-pointer flex items-center justify-center bg-transparent p-2.5 text-white"
                            >
                              <span className="sr-only">Remove</span>
                              <HiOutlineTrash
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 courierNew text-white text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                            {product?.currency} {product?.price}
                          </p>

                          <div className="flex items-center justify-center gap-[1.63rem] border-2 border-[#f3f3f3] cursor-pointer h-[2.25rem] py-[1.06rem] text-white px-[0.88rem]">
                            <span
                              onClick={() => cartDecrementCount(product._id)}
                            >
                              <BiMinus size={20} />
                            </span>
                            <span>{product?.quantity}</span>
                            <span
                              onClick={() => cartIncrementCount(product._id)}
                            >
                              <BiPlus size={20} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t text-white border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="courierNew text-[0.88rem] text-white font-bold leading-[77.5%] tracking-[0.012rem]">
                      Subtotal
                    </dt>
                    <dd className="courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      {selectedCurrency === "AED" ? "AED" : "BDT"}
                      {"  "}
                      {subtotal}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      Shipping
                    </dt>
                    <dd className="courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      {selectedCurrency === "AED" ? "AED 10" : "BDT 80"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      Taxes
                    </dt>
                    <dd className="courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      {selectedCurrency === "AED" ? "AED 10%" : "BDT 15%"}
                    </dd>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={handleCouponCodeChange}
                      className="border border-gray-300 text-black px-4 py-2 rounded-l-md focus:outline-none focus:border-[#38453E]"
                    />
                    <button
                      onClick={applyCouponCode}
                      disabled={discounted}
                      className="bg-[#38453E] text-white px-4 py-2 rounded-r-md"
                    >
                      {discounted ? "Applied" : "Apply"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="courierNew text-[1.25remrem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      Total
                    </dt>
                    <dd className="courierNew text-[1.25remrem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      {discounted && "Discounted Price"} {totalPrice} {"  "}
                      {selectedCurrency === "AED" ? "AED" : "BDT"}
                    </dd>
                  </div>
                </dl>
                <div className="flex px-6 items-center py-[1.44rem] term-checkout">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    className="w-[1.25rem] h-[1.25rem] outline-none border-2 border-[#f3f3f380]"
                  />
                  <label
                    htmlFor="default-checkbox"
                    className="ml-2  text-[#f3f3f380] font-bold text-[.9rem] leading-[122.5%] tracking-[0.01rem] courierNew"
                  >
                    I agree with{" "}
                    <Link
                      to={`/${countryRoute}/contact/shipping-return`}
                      className="underline"
                    >
                      terms and condition
                    </Link>
                  </label>
                </div>
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#2c332e] py-4 border-[#9CA3AF]border text-white focus:outline-none focus:ring-2 focus:ring-[#9CA3AF] focus:ring-offset-2 courierNew text-[1.25remrem] font-bold leading-[77.5%] tracking-[0.012rem]"
                  >
                    Confirm order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {method === "stripe" && (
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <button
                type="button"
                onClick={() => handleMethod("stripe")}
                className={`flex w-full items-center justify-center rounded-md border  py-2 text-white bg-[#38453e] border-[#9CA3AF]`}
              >
                <span className="sr-only">Pay with Stripe</span>
                <FaStripe size={30} className="w-16" aria-hidden="true" />
              </button>

              <div className="relative mt-8">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t-2 border-[#9CA3AF]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#38453e] text-white px-4 text-sm font-medium ">
                    or
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleMethod("COD")}
                className={`flex w-full font-semibold mt-8 items-center justify-center rounded-md border mb-8  text-white py-3 bg-[#38453e] border-[#9CA3AF] `}
              >
                <span className="sr-only">Cash on delivery</span>
                Cash on delivery
              </button>
              <div className="border-t border-gray-200 pt-10">
                <h2 className="text-[#f3f3f3] courierNew text-[1.25rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase">
                  Shipping information
                </h2>
                {userInfo.length > 0 && (
                  <p
                    onClick={handlePrevAddressSet}
                    className="underline text-white courierNew mt-4"
                  >
                    Use Previous Information
                  </p>
                )}
                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="first-name"
                        name="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent outline-none mt-[0.88rem]`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]`}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        autoComplete="street-address"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="apartment"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Apartment, suite, etc.
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="apartment"
                        id="apartment"
                        required
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]  `}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        autoComplete="address-level2"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]  `}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        name="gender"
                        id="gender"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="flex justify-between items-center w-full h-[4rem] text-white text-opacity-[0.42] px-[1.5rem] text-[0.95rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-[#38453e] courierNew gap-[0.63rem] border-2 border-[#9CA3AF] appearance-none outline-none "
                      >
                        <option value="">Select</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="UAE">United State Emirates</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="region"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        autoComplete="address-level1"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        autoComplete="postal-code"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-[#f3f3f3] courierNew text-[.93rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase"
                    >
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        required
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        className={`flex items-center w-full h-[2rem] py-[1.5rem] pl-[1.06rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] `}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-[#f3f3f3] euroWide text-[1.06rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                Order summary
              </h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-transparent shadow-xl">
                <h3 className="sr-only">Items in your cart</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {products?.map((product) => (
                    <li key={product._id} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          src={product.img}
                          alt={product?.item?.productName}
                          className="w-20 rounded-md"
                          loading="lazy"
                        />
                      </div>

                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <a
                                href={product?.href}
                                className="font-medium text-white hover:text-gray-800"
                              >
                                {product?.item?.productName}
                              </a>
                            </h4>
                            <div className="flex items-center gap-2 text-[#f3f3f3] courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem] mt-2">
                              Color:
                              <span
                                style={{
                                  backgroundColor: product.color,
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                }}
                              ></span>
                            </div>
                            <p className="mt-1 text-white courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                              Size: {product.size}
                            </p>
                          </div>

                          <div className="ml-4 flow-root flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => removeProduct(product._id)}
                              className="-m-2.5 flex items-center justify-center bg-transparent p-2.5 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <HiOutlineTrash
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 courierNew text-white text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                            {product?.currency} {product?.price}
                          </p>

                          <div className="flex items-center justify-center gap-[1.63rem] border-2 border-[#f3f3f3] h-[2.25rem] text-white py-[1.06rem] px-[0.88rem]">
                            <button
                              onClick={() => cartDecrementCount(product._id)}
                            >
                              <BiMinus size={20} />
                            </button>
                            <span>{product?.quantity}</span>
                            <button
                              onClick={() => cartIncrementCount(product._id)}
                            >
                              <BiPlus size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="courierNew text-white text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      Subtotal
                    </dt>
                    <dd className="courierNew text-[0.88rem] text-white font-bold leading-[77.5%] tracking-[0.012rem]">
                      {selectedCurrency === "AED" ? "AED" : "BDT"}
                      {"  "} {subtotal}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="courierNew text-white text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      Shipping
                    </dt>
                    <dd className="courierNew text-[0.88rem] text-white font-bold leading-[77.5%] tracking-[0.012rem]">
                      {selectedCurrency === "AED" ? "AED 10" : "BDT 80"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="courierNew text-white text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      Taxes
                    </dt>
                    <dd className="courierNew text-[0.88rem] text-white font-bold leading-[77.5%] tracking-[0.012rem]">
                      {selectedCurrency === "AED" ? "AED 10%" : "BDT 15%"}
                    </dd>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={handleCouponCodeChange}
                      className="border border-gray-300 px-4 py-2 text-black rounded-l-md focus:outline-none focus:border-[#38453E]"
                    />
                    <button
                      onClick={applyCouponCode}
                      disabled={discounted}
                      className="bg-[#38453E] text-white px-4 py-2 rounded-r-md"
                    >
                      {discounted ? "Applied" : "Apply"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="courierNew text-white text-[1.25remrem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      Total
                    </dt>
                    <dd className="courierNew text-white text-[1.25remrem] font-bold leading-[77.5%] tracking-[0.012rem]">
                      {discounted && "Discounted Price"} {totalPrice}{" "}
                      {selectedCurrency === "AED" ? "AED" : "BDT"}
                    </dd>
                  </div>
                  <div className="flex px-6 items-center py-[1.44rem] term-checkout">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="w-[1.25rem] h-[1.25rem] outline-none border-2 border-[#f3f3f380]"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="ml-2  text-[#f3f3f380] font-bold text-[.9rem] leading-[122.5%] tracking-[0.01rem] courierNew"
                    >
                      I agree with{" "}
                      <Link
                        to={`/${countryRoute}/contact/shipping-return`}
                        className="underline"
                      >
                        terms and condition
                      </Link>
                    </label>
                  </div>
                </dl>
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    products={products}
                    address={address}
                    apartment={apartment}
                    handleStripePaymentSuccess={handleStripePaymentSuccess}
                    city={city}
                    country={country}
                    firstName={firstName}
                    lastName={lastName}
                    phone={phone}
                    user={user}
                    totalPrice={totalPrice}
                    state={state}
                    postalCode={postalCode}
                    discounted={discounted}
                    refetch={refetch}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checkout;
