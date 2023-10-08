import { useEffect, useState } from "react";
import { BiMinus, BiPlus, BiX } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";

const SidebarCart = ({
  isCartBarOpen,
  closeCartBar,
  isLoading,
  cartItems,
  refetch,
}) => {
  const [total, setTotalPrice] = useState(0);
  const { selectedCurrency } = useCurrency();

  const removeItem = (e) => {
    const uri = `https://test-originale.onrender.com/cart/delete/${e}`;
    fetch(uri, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        refetch();
      });
  };
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

    if (cartItems && Array.isArray(cartItems)) {
      total = cartItems.reduce((accumulator, item) => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);

        if (!isNaN(price) && !isNaN(quantity)) {
          const subtotal = price * quantity;
          return accumulator + subtotal;
        }

        return accumulator;
      }, 0);
    }

    setTotalPrice(total);
  };
  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);
  if (isLoading) {
    return <Loader />;
  }

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <>
      <div
        className={`fixed bg-[#1c1e22]/50 inset-0 transform ease-in-out
                    ${
                      isCartBarOpen
                        ? "transition-opacity opacity-100 duration-500 translate-x-0 z-[999]"
                        : "transition-all delay-500 opacity-0 translate-x-full"
                    }`}
      >
        <div
          className={`w-screen max-w-[420px] right-0 absolute bg-white h-screen shadow-xl delay-400 duration-500 ease-in-out transition-all transform
                        ${
                          isCartBarOpen ? "translate-x-0" : "translate-x-full "
                        }`}
        >
          <div class="pointer-events-auto w-screen max-w-md">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between border-b border-gray-200 pb-2">
                  <h2 className="text-[#191E1B] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase">
                    Shopping cart
                  </h2>
                  <div
                    className="bg-[--primary-color] p-1 rounded-full cursor-pointer ml-3 flex h-7 items-center"
                    onClick={closeCartBar}
                  >
                    <BiX size={25} />
                  </div>
                </div>
                <div class="mt-8">
                  <div class="flow-root">
                    <ul role="list" class="-my-6 divide-y divide-gray-200">
                      {cartItems?.map((product, index) => (
                        <li
                          class="py-4 flex border-[1.26px] border-[#dcdcdc]"
                          key={index}
                        >
                          <div class="h-28 w-24 flex-shrink-0 overflow-hidden">
                            <img
                              src={product?.img}
                              alt={product?.item.productName}
                              class="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div class="ml-6 flex flex-1 flex-col">
                            <div>
                              <div class="flex flex-col gap-[0.56rem] items-start">
                                <Link
                                  to={`/${countryRoute}/product/${product._id}`}
                                >
                                  <h3 className="text-[#747474] euroWide text-[.78rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                                    {product?.item.productName}
                                  </h3>
                                </Link>
                                <p class="text-[#32493D] euroWide text-[.78rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                                  {selectedCurrency === "BDT" ? (
                                    <p> BDT {product.price}</p>
                                  ) : (
                                    <p> AED {product.price}</p>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-[0.56rem] mt-2">
                                <div className="flex items-center justify-between gap-[1.63rem] border-2 border-[#191E1B] h-[2.25rem] py-[1.06rem] px-[1.19rem]">
                                  <button
                                    onClick={() =>
                                      cartDecrementCount(product._id)
                                    }
                                  >
                                    <BiMinus size={20} />
                                  </button>
                                  <span>{product.quantity}</span>
                                  <button
                                    onClick={() =>
                                      cartIncrementCount(product._id)
                                    }
                                  >
                                    <BiPlus size={20} />
                                  </button>
                                </div>
                                <div className="remove-item">
                                  <button
                                    onClick={() => removeItem(product._id)}
                                  >
                                    <MdDeleteOutline size={25} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <p className="text-[#191E1B] text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase courierNew">
                    Subtotal
                  </p>
                  <p className="text-[#191E1B] text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase courierNew ml-[1.5rem]">
                    <span className="currency">
                      {selectedCurrency === "BDT" ? "BDT" : "AED"}
                    </span>{" "}
                    <span className="amount">{total.toFixed(2)}</span>
                  </p>
                </div>
                <div class="mt-6">
                  <Link
                    to={`/${countryRoute}/cart`}
                    class="view-cart border-2 border-black text-[1.0625rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew flex items-center justify-center bg-transparent px-6 py-3 text-black"
                  >
                    View Cart
                  </Link>
                </div>
                <div class="mt-6">
                  <Link
                    to={`/${countryRoute}/checkout`}
                    class="checkout border-2 bg-black text-white text-[1.0625rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew flex items-center justify-center px-6 py-3"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
