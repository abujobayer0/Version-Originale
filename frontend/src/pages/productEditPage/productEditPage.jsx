import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the React Quill styles
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const ProductEditPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    _id: "",
    productName: "",
    bdPrice: 0,
    dubaiPrice: 0,
    bdPriceSale: 0,
    dubaiPriceSale: 0,
    description: "",
    colors: [],
  });
  const [bdPriceSale, setBdPriceSale] = useState(0);
  const [dubaiPriceSale, setDubaiPriceSale] = useState(0);
  const [quantityValues, setQuantityValues] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://test-originale.onrender.com/newProduct/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        const colors = Array.isArray(data.colorsValue)
          ? data.colorsValue
          : [data.colorsValue];
        const sizes = Array.isArray(data.sizesValue)
          ? data.sizesValue
          : [data.sizesValue];

        setProduct({
          _id: data._id,
          productName: data.productName,
          bdPrice: data.bdPrice,
          dubaiPrice: data.dubaiPrice,
          description: data.description,
          colors: colors,
        });
        setBdPriceSale(data.bdPriceSale);
        setDubaiPriceSale(data.dubaiPriceSale);
        setQuantityValues(JSON.parse(sizes));
      } else {
        console.error("Failed to fetch product data");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: value,
    }));
  };

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;

    // Ensure value is a non-negative number
    const parsedValue = parseInt(value, 10);
    const newValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);

    setQuantityValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      _id,
      productName,
      colors,
      bdPrice,
      dubaiPrice,
      description,
    } = product;
    const sum = Object.values(quantityValues).reduce(
      (acc, val) => acc + val,
      0
    );
    const updatedColors = JSON.parse(colors).map((tag) => ({
      name: tag.name,
      value: sum,
    }));
    const bdSale = parseInt(bdPriceSale);
    const dubaiSale = parseInt(dubaiPriceSale);
    const newProduct = {
      _id,
      productName,
      bdPrice,
      dubaiPrice,
      bdPriceSale: bdSale,
      dubaiPriceSale: dubaiSale,
      description,
      sizesValue: JSON.stringify(quantityValues),
      colorsValue: JSON.stringify(updatedColors),
    };
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://test-originale.onrender.com/update/product/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.ok) {
        setMessage("Product updated successfully");
      } else {
        setMessage("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [id]);
  console.log(product);
  return (
    <div className="bg-gray-100 p-6 mx-auto w-full md:w-1/2 rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Update Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label
            htmlFor="productName"
            className="block text-gray-700 font-bold mb-2"
          >
            Product Name:
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            onChange={handleInputChange}
            value={product.productName}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        {/* Product Description */}
        <div className="mb-4">
          <label
            htmlFor="productDescription"
            className="block text-gray-700 font-bold mb-2"
          >
            Product Description:
          </label>
          <div className="w-full">
            <ReactQuill
              value={product.description} // Fix: Use product.description as value
              onChange={handleDescriptionChange}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  [{ align: [] }],
                ],
              }}
              className="bg-white border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>
        {/* BD Price */}
        <div className="mb-4">
          <label
            htmlFor="bdPrice"
            className="block text-gray-700 font-bold mb-2"
          >
            BD Price:
          </label>
          <input
            type="text"
            onChange={handleInputChange}
            id="bdPrice"
            value={product.bdPrice}
            name="bdPrice"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        {/* Dubai Price */}
        <div className="mb-4">
          <label
            htmlFor="dubaiPrice"
            className="block text-gray-700 font-bold mb-2"
          >
            Dubai Price:
          </label>
          <input
            type="text"
            onChange={handleInputChange}
            id="dubaiPrice"
            name="dubaiPrice"
            value={product.dubaiPrice}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="bdPriceSale"
            className="block text-gray-700 font-bold mb-2"
          >
            BD Price Sale:
          </label>
          <input
            type="text"
            onChange={(e) => setBdPriceSale(e.target.value)}
            id="bdPriceSale"
            value={bdPriceSale}
            name="bdPriceSale"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="dubaiPriceSale"
            className="block text-gray-700 font-bold mb-2"
          >
            Dubai Price Sale:
          </label>
          <input
            type="text"
            onChange={(e) => setDubaiPriceSale(e.target.value)}
            id="dubaiPriceSale"
            name="dubaiPriceSale"
            value={dubaiPriceSale}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <label htmlFor="size" className="block text-gray-700 font-bold mb-2">
          Size:
        </label>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">Quantity</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(quantityValues).map((size) => (
              <div key={size} className="flex items-center shadow-sm">
                <label htmlFor={size} className="bg-gray-100 p-2">
                  {size}
                </label>
                <input
                  className="w-full px-4 py-2 focus:outline-none"
                  type="number"
                  name={size}
                  value={quantityValues[size]}
                  onChange={handleQuantityChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 mt-8 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Product"}
        </button>

        {message && <div className="mt-2 text-green-500">{message}</div>}
      </form>
    </div>
  );
};

export default ProductEditPage;
