import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
const OrderCreateForm = ({ refetch }) => {
  const [product, selectProduct] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [selectCurrency, setSelectCurrency] = useState("BDT");
  const idref = useRef();
  const findProduct = (e) => {
    fetch(`https://test-originale.onrender.com/product/${e}`)
      .then((res) => res.json())
      .then((data) => selectProduct(data));
  };

  function calculateTotalPrice(productPrice, quantity) {
    let totalPrice = productPrice * parseInt(quantity);

    return totalPrice;
  }
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!product) {
      return;
    }
    try {
      const productPrice =
        selectCurrency === "BDT"
          ? product[0]?.bdPriceSale
          : product[0]?.dubaiPriceSale;

      const totalPrice = await calculateTotalPrice(productPrice, quantity);
      const payment_info = {
        method: "COD",
        address: "",
        apartment: "",
        city: "",
        country: "",
        firstName: "",
        lastName: "",
        phone: "",
        order_items: [
          {
            added_by: "admin",
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            item: product[0],
            currency: selectCurrency,
            img: product[0]?.productImage[0],
          },
        ],
        email: "",
        totalPrice: totalPrice,
        currency: selectCurrency,
        state: "",
        postalCode: "",
        date: new Date(),
        discounted: false,
        active_status: "on processing",
        status: ["packed", "on processing", "delivered", "return", "shipped"],
      };
      fetch(
        "https://test-originale.onrender.com/admin/order/custom/create?email=admin",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ payment_info }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            Swal.fire("Order Placed!");
            selectProduct([]);
            setSelectedColor("");
            setSelectedSize("");
            setPaymentMethod("");
            idref.current.value = "";
            refetch();
          }
        });
    } catch (err) {
      console.log(err);
    } finally {
      // console.log()
    }
  };
  const sizes =
    product && product[0]?.sizes ? JSON.parse(product[0]?.sizes) : null;
  const colors =
    product && product[0]?.colors
      ? Array.isArray(product[0].colors)
        ? product[0].colors
        : [product[0].colors]
      : null;

  return (
    <div className="bg-gray-50 w-full  mb-4 p-4 mt-4 lg:mt-0 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Custom Order</h2>
      <div className="flex flex-col w-full">
        <div className="mb-4 w-full md:w-1/3">
          <label
            htmlFor="productName"
            className="block text-gray-600 font-semibold"
          >
            Product Id:
          </label>
          <input
            type="text"
            ref={idref}
            id="productName"
            onChange={(e) => findProduct(e.target.value)}
            name="productName"
            className="w-full  px-4 py-2  border rounded-lg focus:outline-none "
          />
        </div>
        <div className="flex w-full">
          <form
            onSubmit={handlePlaceOrder}
            className="w-full py-2 flex flex-col bg-gray-100 gap-4 px-4"
          >
            <h2 className="text-xl p-4">{product[0]?.productName}</h2>
            <div className="w-full grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              <span className="bg-[#839f9099] items-center w-full p-2 flex gap-2">
                <label className="text-white">Select Color</label>
                <select
                  name="color"
                  onChange={(e) => setSelectedColor(e.target.value)}
                  value={selectedColor}
                >
                  <option value="">select one</option>
                  {colors?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </span>
              <span className="bg-[#839f9099] items-center w-full p-2 flex gap-2">
                <label className="text-white">Select Sizes</label>
                <select
                  name="sizes"
                  required
                  onChange={(e) => setSelectedSize(e.target.value)}
                  value={selectedSize}
                >
                  <option value="">select one</option>
                  {sizes?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </span>
              <span className="bg-[#839f9099] w-full items-center p-2 flex gap-2">
                <label className="text-white">Select Currency</label>
                <select
                  name="sizes"
                  required
                  onChange={(e) => setSelectCurrency(e.target.value)}
                  value={selectCurrency}
                >
                  <option value="">select one</option>
                  <option value="BDT">BDT</option>
                  <option value="AED">AED</option>
                </select>
              </span>
              <span className="bg-[#839f9099] items-center w-full p-2 flex gap-2">
                <label className="text-white">Payment method: </label>
                <select
                  name="payment"
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">select one</option>
                  <option value="MFS">MFS</option>
                  <option value="COD">COD</option>
                  <option value="stripe">Bank</option>
                </select>
              </span>
              <span className="bg-[#839f9099] w-full items-center p-2 flex gap-2">
                <label className="text-white">Quantity: </label>
                <input
                  onChange={(e) => setQuantity(e.target.value)}
                  value={quantity}
                  type="number"
                  required
                  placeholder="type quantity"
                  className="px-2 w-full py-2"
                />
              </span>
            </div>

            <button
              type="submit"
              className="p-4 mt-8 text-white bg-[#839f9099]"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderCreateForm;
