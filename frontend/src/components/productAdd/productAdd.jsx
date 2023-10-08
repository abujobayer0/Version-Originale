import { useEffect, useState } from "react";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { TagsInput } from "react-tag-input-component";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";

const ProductAdd = () => {
  const { data, isLoading } = useGetData("/categories");
  const { data: forSubCategory, isLoading: loading } = useGetData(
    "/api/categories"
  );
  // Product data states
  const [productName, setProductName] = useState("");
  const [bdPrice, setBdPrice] = useState(0);
  const [bdPriceSale, setBdPriceSale] = useState(0);
  const [dubaiPrice, setDubaiPrice] = useState(0);
  const [dubaiPriceSale, setDubaiPriceSale] = useState(0);

  const [quantityValues, setQuantityValues] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [selected, setSelected] = useState([]);
  const [adding, setAdding] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [subCat, setSubCat] = useState([]);

  useEffect(() => {
    setSubCat(
      forSubCategory && forSubCategory.filter((i) => i.category === category)
    );
  }, [category]);

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };
  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10);
    const newValue = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
    setQuantityValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };
  const handleBdPriceChange = (e) => {
    setBdPrice(e.target.value);
  };
  const handleBdPriceSaleChange = (e) => {
    setBdPriceSale(e.target.value);
  };

  const handleDubaiPriceChange = (e) => {
    setDubaiPrice(e.target.value);
  };

  const handleDubaiPriceSaleChange = (e) => {
    setDubaiPriceSale(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
  };

  const handleFeaturedChange = (e) => {
    setFeatured(e.target.checked);
  };
  const quillModules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];
  const editorStyles = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "300px",
    padding: "10px",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    color: "black",
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages([...productImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sum = Object.values(quantityValues).reduce(
      (acc, val) => acc + val,
      0
    );
    const selectedWithSums = selected.map((tag) => ({
      name: tag,
      value: sum,
    }));
    setAdding(true);
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("bdPrice", parseFloat(bdPrice));
    formData.append("bdPriceSale", parseFloat(bdPriceSale));
    formData.append("dubaiPrice", parseFloat(dubaiPrice));
    formData.append("dubaiPriceSale", parseFloat(dubaiPriceSale));
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("featured", featured);
    formData.append("description", description);
    formData.append("sizesValue", JSON.stringify(quantityValues));
    formData.append("colorsValue", JSON.stringify(selectedWithSums));
    formData.append("sizes", JSON.stringify(["S", "M", "L", "XL", "XXL"]));

    for (let i = 0; i < productImages.length; i++) {
      formData.append("files", productImages[i]);
    }
    for (let i = 0; i < selected.length; i++) {
      formData.append("colors", selected[i]);
    }
    try {
      await fetch("https://test-originale.onrender.com/add/product", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result.acknowledged) {
            toast.success("Product Added");
            setAdding(false);
          } else {
            toast.error("Something Went Wrong");
          }
        });
    } catch (err) {
      console.log(err);
    } finally {
      setProductName("");
      setBdPrice(0);
      setCategory("");
      setDescription("");
      setDubaiPrice(0);
      setFeatured(false);
      setProductImages([]);
      setSelected([]);
    }
  };

  return (
    <div className="bg-gray-50 lg:w-[90%] p-4 w-full min-h-screen shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">
            Product Name
          </label>
          <input
            type="text"
            required
            name="productName"
            value={productName}
            onChange={handleProductNameChange}
            className="w-full px-4 py-2 border focus:outline-none "
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">
            Product Price (BD)
          </label>
          <input
            type="number"
            name="bdPrice"
            required
            value={bdPrice}
            onChange={handleBdPriceChange}
            className="w-full px-4 py-2 border focus:outline-none "
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">
            Sale Price (BD)
          </label>
          <input
            type="number"
            name="bdPriceSale"
            required
            value={bdPriceSale}
            onChange={handleBdPriceSaleChange}
            className="w-full px-4 py-2 border focus:outline-none "
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">
            Product Price (Dubai)
          </label>
          <input
            type="number"
            name="dubaiPrice"
            required
            value={dubaiPrice}
            onChange={handleDubaiPriceChange}
            className="w-full px-4 py-2 border focus:outline-none "
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">
            Sale Price (Dubai)
          </label>
          <input
            type="number"
            name="dubaiPriceSale"
            required
            value={dubaiPriceSale}
            onChange={handleDubaiPriceSaleChange}
            className="w-full px-4 py-2 border focus:outline-none "
          />
        </div>

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

        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">
            Select Color
          </label>
          <TagsInput
            value={selected}
            onChange={setSelected}
            name="colors"
            place="Add Colors"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">Category</label>
          <select
            name="category"
            value={category}
            onChange={handleCategoryChange}
            required
            className="w-full px-4 py-2 border focus:outline-none "
          >
            <option value="">Select Category</option>
            {!isLoading &&
              data?.map((item, indx) => (
                <option key={indx} value={item.category}>
                  {item.category}
                </option>
              ))}
          </select>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">
            Subcategory
          </label>
          <select
            name="subCategory"
            value={subCategory}
            onChange={handleSubCategoryChange}
            required
            className="w-full px-4 py-2 border focus:outline-none "
          >
            <option value="">Select subCategory</option>
            {!loading && (
              <>
                {subCat?.map((subItem) => (
                  <>
                    {subItem?.subCategory.map((i, x) => (
                      <option key={x} value={i}>
                        {i}
                      </option>
                    ))}
                  </>
                ))}
              </>
            )}
          </select>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-gray-600 font-semibold">Featured</label>
          <input
            type="checkbox"
            name="featured"
            checked={featured}
            onChange={handleFeaturedChange}
            className="px-2 w-6 h-6 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-gray-600 font-semibold">
            Product Images
          </label>
          <input
            type="file"
            name="productImage"
            multiple
            required
            accept="image/*"
            onChange={handleImageChange}
            className="w-full py-2 border focus:outline-none "
          />
        </div>
        {productImages?.length > 0 && (
          <div className="col-span-2">
            <label className="block text-gray-600 font-semibold">
              Image Preview
            </label>
            <div className="flex flex-wrap gap-4">
              {productImages?.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Product Image ${index}`}
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute  top-0 right-0 px-2  bg-green-900 text-white rounded-full hover:bg-green-400 focus:outline-none"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="col-span-2 relative mb-24 ">
          <label className="block mb-2 font-bold">Product Description</label>

          <ReactQuill
            id="description"
            value={description}
            onChange={setDescription}
            theme="snow"
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write an Impressive Product description..."
            style={editorStyles}
          />
        </div>
        <button
          type="submit"
          className="col-span-1 relative bg-[#acbdb2] text-white px-6 py-4 "
        >
          {adding ? "Adding...." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductAdd;
