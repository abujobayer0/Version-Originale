import {
  HiCheckCircle,
  HiClock,
  HiQuestionMarkCircle,
  HiX,
} from "react-icons/hi";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";

const auth = getAuth(app);
const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotal, setSubTotal] = useState(0);
  const { selectedCurrency } = useCurrency();

  const [user] = useAuthState(auth);
  const { data, isLoading, refetch } = useGetData(
    `/cart/item?email=${user?.email}`
  );
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

    if (data && Array.isArray(data)) {
      total = data.reduce((accumulator, item) => {
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

    const taxPercentage = 15; // Update tax to 15%
    const shippingFee = selectedCurrency === "BDT" ? 80 : 10;

    const taxAmount = (total * taxPercentage) / 100;
    total += taxAmount + shippingFee;

    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  const removeProduct = (e) => {
    const uri = `https://test-originale.onrender.com/cart/delete/${e}`;
    fetch(uri, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        refetch();
      });
  };

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl sm:text-4xl text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase">
          Shopping Cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {data?.map((product) => (
                <li key={product?.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={product?.img}
                      alt={product?.item?.productName}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-start sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <Link>
                            <h3 className="text-[#f3f3f3] line-clamp-2 courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                              {product?.item?.productName}
                            </h3>
                          </Link>
                        </div>
                        <div className="mt-[0.56rem] flex flex-col gap-[0.34rem]">
                          <div className="flex items-center gap-2 text-[#f3f3f3] courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                            Color :
                            <span
                              style={{
                                backgroundColor: product.color,
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                              }}
                            ></span>
                          </div>
                          {product.size ? (
                            <p className="text-[#f3f3f3] courierNew text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                              Size: {product.size}
                            </p>
                          ) : null}
                        </div>
                        <p className="text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] mt-3">
                          {product.price} {product.currency}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9 flex justify-center items-center">
                        <div className="flex items-center justify-center gap-[1.63rem] border-2 text-white border-[#f3f3f3] h-[2.25rem] py-[1.06rem] px-[0.88rem]">
                          <button
                            onClick={() => cartDecrementCount(product?._id)}
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
                        <button
                          onClick={() => removeProduct(product._id)}
                          type="button"
                          className="ml-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove</span>
                          <HiX className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 flex items-center space-x-2 text-sm text-gray-700">
                      {product.inStock ? (
                        <HiCheckCircle
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <HiClock
                          className="h-5 w-5 flex-shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                      )}

                      <span className="text-[0.88rem] font-bold leading-[77.5%] tracking-[0.012rem] courierNew">
                        {product ? "In stock" : `Ships in `}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-[#2c332e] px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-xl"
          >
            <h2
              id="summary-heading"
              className="text-[#f3f3f3] euroWide text-[1.06rem] font-bold leading-[122.5%] tracking-[0.0089rem]"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                  Subtotal
                </dt>
                <dd className="text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                  {selectedCurrency === "BDT" ? `BDT ` : `AED `}
                  {subtotal.toFixed(2)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <HiQuestionMarkCircle
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                  {selectedCurrency === "BDT" ? `BDT 80` : `AED 10`}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <HiQuestionMarkCircle
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-[#f3f3f3] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                  15%{" "}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-[#f3f3f3] euroWide text-[1.06rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                  Order total
                </dt>
                <dd className="text-[#f3f3f3] euroWide text-[.88rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                  {selectedCurrency === "BDT" ? "BDT " : "AED "}
                  {totalPrice.toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                to={`/${countryRoute}/checkout`}
                className="w-full block text-center rounded-md border border-transparent bg-[#38453e] py-4 px-4 text-base text-white shadow-sm focus:outline-none text-[1.24rem] font-bold leading-[77.5%] tracking-[0.009rem] uppercase courierNew"
              >
                Checkout
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cart;
