import { HiTrash } from "react-icons/hi";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../loader/Loader";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ProductTable = () => {
  const { data: products, isLoading, refetch } = useGetData("/newProducts");
  if (isLoading) {
    return <Loader />;
  }

  const handleFeatured = async (e) => {
    try {
      await fetch(`https://test-originale.onrender.com/change/featured/${e}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.modifiedCount > 0) {
            refetch();
          }
        });
    } catch (err) {
      console.log(err);
    } finally {
      console.log("");
    }
  };

  const handleDelete = (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `https://test-originale.onrender.com/vo/api/v1/delete/product/${e}`,
          {
            method: "DELETE",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              refetch();
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
          });
      }
    });
  };
  console.log(!isLoading && products.map((i) => i.sizes));
  return (
    <div className="bg-gray-50 max-w-full relative  overflow-x-auto p-4 -lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Product Table</h2>
      <div className="scrollable-container">
        <table className=" ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                BDT
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                AED
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Sizes
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Colors
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Subcategory
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Featurd
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Delete
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product._id}>
                <td className="px-4  py-4 whitespace-nowrap text-[12px]">
                  {product?._id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  {product?.productName}
                </td>
                <td className="px-2 py-  whitespace-nowrap text-[12px]">
                  <span className="bg-green-100 p-2">
                    BDT-{product?.bdPrice}/ Sale-{" "}
                    {product?.bdPriceSale !== 0 ? product?.bdPriceSale : "N/A"}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[12px]">
                  <span className="p-2 bg-red-100">
                    AED-{product?.dubaiPrice}/ Sale-{" "}
                    {product?.dubaiPriceSale !== 0
                      ? product?.dubaiPriceSale
                      : "N/A"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  {product && typeof product.sizesValue === "string"
                    ? Object.entries(JSON.parse(product.sizesValue)).map(
                        ([size, value], index) => (
                          <span key={index} className="p-2 font-bold">
                            <span
                              style={{ color: value === 0 ? "red" : "inherit" }}
                            >
                              {size}:{"  "}
                              {value}
                            </span>
                            {index <
                            Object.entries(JSON.parse(product.sizesValue))
                              .length -
                              1
                              ? ", "
                              : ""}
                          </span>
                        )
                      )
                    : product?.sizesValue || ""}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  {Array.isArray(product?.colors) ? (
                    <>
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          className="inline-block border w-4 h-4 mr-1"
                          style={{ backgroundColor: color }}
                        ></span>
                      ))}
                    </>
                  ) : (
                    <span
                      className="inline-block border w-4 h-4"
                      style={{ backgroundColor: product?.colors }}
                    ></span>
                  )}
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  {product?.category}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  {product?.subCategory}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  {product?.featured === true ? (
                    <button
                      title="click to remove from featured"
                      className="bg-green-400 p-2  white"
                      onClick={() => handleFeatured(product._id)}
                    >
                      Yes
                    </button>
                  ) : (
                    <button
                      title="click for add to featured"
                      className="bg-[#839f9099] p-2  white"
                      onClick={() => handleFeatured(product._id)}
                    >
                      No
                    </button>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 "
                  >
                    <HiTrash />
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[12px]">
                  <Link
                    to={`/admin/edit/product/${product._id}`}
                    className="bg-blue-500 w-44 hover:bg-blue-600 text-white p-3 "
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
