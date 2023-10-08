import { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import {
  BiCategory,
  BiChevronDown,
  BiPlus,
  BiRefresh,
  BiTrash,
} from "react-icons/bi";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../loader/Loader";
import axios from "axios";
import Swal from "sweetalert2";

const AdminCategory = () => {
  const { data, isLoading, refetch } = useGetData("/categories");
  const {
    data: forDelete,
    isLoading: deleteProd,
    refetch: DltProdRfc,
  } = useGetData("/api/categories");

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [deleteCat, setDeleteCat] = useState([]);
  const [subForDlt, setSubForDlt] = useState();
  const [catForDlt, setCatForDltSub] = useState("");
  const handleDeleteSubCategory = (e) => {
    e.preventDefault();
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
        try {
          fetch(
            `https://test-originale.onrender.com/categories/${catForDlt}/subcategories/${subForDlt}`,
            {
              method: "DELETE",
            }
          )
            .then((res) => res.json())
            .then((data) => {
              if (data) {
                refetch();
                DltProdRfc();
              }
            });
        } catch (err) {
          console.log(err);
        } finally {
          setSubForDlt("");
          setCatForDltSub("");
        }
      }
    });
  };
  const [subCat, setSubCat] = useState([]);

  const toggleSort = (categoryName) => {
    setCategoryOpen((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };
  useEffect(() => {
    setSubCat(data && data?.filter((i) => i.category === catForDlt));
  }, [catForDlt]);
  if (isLoading || deleteProd) {
    return <Loader />;
  }

  const handleSubCategoryAdd = async (e) => {
    e.preventDefault();
    if (!category || !subCategory) {
      return;
    } else {
      try {
        const response = await axios.post(
          "https://test-originale.onrender.com/add/subCategory",
          { category: category, subCategory: subCategory },
          { headers: { "Content-type": "application/json" } }
        );

        toast.success("SubCategory Added Successfully!");
      } catch (err) {
        console.log(err);
        toast.warn("Something went wrong!");
      } finally {
        setCategory("");
        setSubCategory("");
      }
    }
  };

  const handleCategoryAdd = async (e) => {
    e.preventDefault();
    if (!newCategory) {
      return;
    } else {
      try {
        const response = await axios.post(
          "https://test-originale.onrender.com/add/category",
          { category: newCategory },
          { headers: { "Content-type": "application/json" } }
        );

        toast.success("Category Added Successfully!");
      } catch (err) {
        console.log(err);
      } finally {
        setNewCategory("");
      }
    }
  };

  const handleRefetch = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
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
        fetch(`https://test-originale.onrender.com/vo/api/delete/category/${deleteCat}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              refetch();
              DltProdRfc();
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
          });
      }
    });
  };
  return (
    <div className="w-full p-4 bg-gray-50 shadow-md">
      <ToastContainer />
      <h2 className="text-2xl w-full font-semibold px-10 mb-4">
        Category Manage
      </h2>
      <div className="">
        {data?.map((item, index) => (
          <div key={index} className="py-[0.50rem] container">
            <div
              onClick={() => toggleSort(item.category)}
              className="flex mb-4 justify-between items-center cursor-pointer text-gray-600 px-4  w-full text-left  "
            >
              <h3 className=" text-lg flex items-center font-semibold leading-[77.5%] tracking-[0.012rem]">
                <span className="bg-gray-100 rounded mr-4 p-2">
                  <img
                    width="30"
                    height="30"
                    src="https://i.ibb.co/3BhvSTX/categories.png"
                    className="w-6"
                    alt="document"
                    loading="lazy"
                  />{" "}
                </span>
                {item.category} ({item.subCategory?.length})
              </h3>
              <button
                className={`${
                  categoryOpen[item.category] ? "rotate-180" : "rotate-0"
                }`}
              >
                {item.subCategory.length > 0 && <BiChevronDown size={25} />}
              </button>
            </div>
            <Collapse
              isOpened={categoryOpen[item.category]}
              className={`collapsible-content ${
                categoryOpen[item.category] ? "opened" : ""
              }`}
            >
              {item.subCategory &&
                item.subCategory.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex  bg-gray-100 py-2 dropdown_sort flex-col"
                  >
                    <span className=" text-start cursor-pointer  xl:text-[17px] leading-[77.5%] font-semibold tracking-[0.012rem] text-[#333] uppercase ">
                      <button className="px-4  w-full text-left  text-sm text-gray-700 flex items-center hover:text-gray-900">
                        <span className="mr-2 bg-gray-50 p-2">
                          <BiCategory />
                        </span>

                        {sub}
                      </button>
                    </span>
                  </div>
                ))}
            </Collapse>
          </div>
        ))}
      </div>

      <div className="p-10 bg-gray-200">
        <h2 className="text-lg w-full font-semibold mb-4">Add Subcategory</h2>
        <form
          onSubmit={handleSubCategoryAdd}
          className="flex flex-col justify-start md:flex-row items-start md:items-center gap-6 w-full"
        >
          <div className="w-full">
            <label
              htmlFor="category"
              className="font-bold whitespace-nowrap flex items-center gap-2"
            >
              Category:{" "}
              <button onClick={handleRefetch} className="text-3xl">
                {!refreshing ? (
                  <BiRefresh />
                ) : (
                  <BiRefresh className="animate-spin" />
                )}
              </button>
            </label>
            <select
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Category</option>
              {data?.map((item, index) => (
                <option key={index} value={item.category}>
                  {item.category}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="subcategory" className="font-bold block ">
              Subcategory:
            </label>
            <input
              type="text"
              id="subcategory"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="font-bold block">add</label>

            <button
              type="submit"
              className="p-2 text-white flex items-center whitespace-nowrap bg-green-600"
            >
              <BiPlus /> add subcategory
            </button>
          </div>
        </form>
      </div>
      <div className="p-10 bg-gray-200">
        <h2 className="text-lg w-full font-semibold mb-4">Add Categories</h2>
        <form
          onSubmit={handleCategoryAdd}
          className="flex flex-col justify-start md:flex-row items-start md:items-center gap-6 w-full"
        >
          <div className="w-full md:w-1/2">
            <label htmlFor="subcategory" className="font-bold block">
              Category:
            </label>
            <input
              type="text"
              id="subcategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="font-bold block">add</label>

            <button
              type="submit"
              className="p-2 text-white flex items-center whitespace-nowrap bg-green-600"
            >
              <BiPlus /> add Category
            </button>
          </div>
        </form>

        <form
          onSubmit={handleDelete}
          className="flex flex-col justify-start md:flex-row items-start md:items-center mt-8 gap-6 w-full"
        >
          <div className="w-full md:w-1/2">
            <label htmlFor="subcategory" className="font-bold block">
              Delete Category :
            </label>
            <select
              id="category"
              onChange={(e) => setDeleteCat(e.target.value)}
              value={deleteCat}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Category</option>
              {forDelete?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.category}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <label className="font-bold block">Delete</label>

            <button
              type="submit"
              className="p-3 justify-center w-24 text-lg  text-white flex items-center whitespace-nowrap bg-red-500 hover:bg-red-600"
            >
              <BiTrash />
            </button>
          </div>
        </form>

        <form
          onSubmit={handleDeleteSubCategory}
          className="flex flex-col mt-8 justify-start md:flex-row items-start md:items-center gap-6 w-full"
        >
          <div className="w-full">
            <label
              htmlFor="category"
              className="font-bold whitespace-nowrap flex items-center gap-2"
            >
              Category:{" "}
              <button onClick={handleRefetch} className="text-3xl">
                {!refreshing ? (
                  <BiRefresh />
                ) : (
                  <BiRefresh className="animate-spin" />
                )}
              </button>
            </label>
            <select
              id="category"
              onChange={(e) => setCatForDltSub(e.target.value)}
              value={catForDlt}
              required
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Category</option>
              {data?.map((item, index) => (
                <option key={index} value={item.category}>
                  {item.category}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="subcategory" className="font-bold block ">
              Subcategory:
            </label>
            <select
              id="subCategory"
              onChange={(e) => setSubForDlt(e.target.value)}
              value={subForDlt}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Category</option>
              {subCat?.map((item) => (
                <>
                  {item.subCategory?.map((i, x) => (
                    <option key={x} value={i}>
                      {i}
                    </option>
                  ))}
                </>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold block">Delete</label>

            <button
              type="submit"
              className="p-2 text-white flex items-center whitespace-nowrap bg-red-600"
            >
              <BiPlus /> Delete SubCategory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategory;
