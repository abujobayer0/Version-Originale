import { useState } from "react";
import { Collapse } from "react-collapse";
import { BiChevronDown } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const toggleSort = () => {
    setIsProductOpen((prev) => !prev);
  };

  return (
    <div className="w-full xl:w-[300px]  relative left-0 ">
      <div className="py-2 px-4 bg-gray-50 divide-y">
        <h2 className="text-[#2c332e] pb-8 text-base mt-8 xl:text-[1.55rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase  mx-auto text-center">
          Admin
        </h2>
        <ul className="flex flex-col">
          <NavLink to={"/admin"}>
            <div className="mt-4 flex justify-between items-center cursor-pointer px-4 rounded w-full text-left py-2 text-sm    text-[#333]">
              <h3 className=" pt-4 text-lg font-semibold leading-[77.5%] tracking-[0.012rem] ">
                Dashboard
              </h3>
            </div>
          </NavLink>
          <div className="">
            <div
              onClick={toggleSort}
              className="mt-4 flex justify-between items-center cursor-pointer text-[#333] px-4 rounded w-full text-left py-2 text-sm  "
            >
              <h3 className=" text-lg font-semibold leading-[77.5%] tracking-[0.012rem] ">
                Product
              </h3>
              <button
                className={`${isProductOpen ? "rotate-180" : "rotate-0"}`}
              >
                <BiChevronDown size={25} />
              </button>
            </div>
            <Collapse
              isOpened={isProductOpen}
              className={`collapsible-content ${isProductOpen ? "opened" : ""}`}
            >
              <div className="flex dropdown_sort bg-gray-100 flex-col">
                <Link to={"admin-product-add"}>
                  <li className="py-2 text-start cursor-pointer  xl:text-[17px] leading-[77.5%] font-semibold tracking-[0.012rem] text-[#0000006B] uppercase ">
                    <button className="block px-4 rounded w-full text-left py-2 text-sm text-gray-700 ">
                      Product Add
                    </button>
                  </li>
                </Link>
                <Link to={"admin-products"}>
                  <li className="py-2 text-start cursor-pointer  xl:text-[17px] leading-[77.5%] font-semibold tracking-[0.012rem] text-[#0000006B] uppercase ">
                    <button className="block px-4 rounded w-full text-left py-2 text-sm text-gray-700 ">
                      All Products
                    </button>
                  </li>
                </Link>
              </div>
            </Collapse>
          </div>

          <Link to={"admin-category-manage"}>
            <div className="mt-4 flex justify-between items-center cursor-pointer text-[#333] px-4 rounded w-full text-left py-2 text-sm ">
              <h3 className=" text-lg font-semibold leading-[77.5%] tracking-[0.012rem] ">
                Category
              </h3>
            </div>
          </Link>
          <Link to={"admin-orderlist"}>
            <div className="flex pt-4 mt-4 justify-between items-center cursor-pointer px-4 rounded w-full text-left py-2 text-sm   text-[#333]">
              <h3 className=" text-lg font-semibold leading-[77.5%] tracking-[0.012rem] ">
                Orders
              </h3>
            </div>
          </Link>
          <Link to={"admin-customer-manage"}>
            <div className="flex pt-4 mt-4 justify-between items-center cursor-pointer px-4 rounded w-full text-left py-2 text-sm   text-[#333]">
              <h3 className=" text-lg font-semibold leading-[77.5%] tracking-[0.012rem] ">
                Customer
              </h3>
            </div>
          </Link>
          <Link to={"admin-story-add"}>
            <div className="flex pt-4 mt-4 justify-between items-center cursor-pointer px-4 rounded w-full text-left py-2 text-sm   text-[#333]">
              <h3 className=" text-lg font-semibold leading-[77.5%] tracking-[0.012rem] ">
                Story Add
              </h3>
            </div>
          </Link>
          <Link to={"admin-couponCode"}>
            <div className="flex pt-4 mt-4 justify-between items-center cursor-pointer px-4 rounded w-full text-left py-2 text-sm   text-[#333]">
              <h3 className=" text-lg font-semibold leading-[77.5%] tracking-[0.012rem] ">
                Coupon Code
              </h3>
            </div>
          </Link>
        </ul>
      </div>
      <Link to={"/"}>
        <button className="px-4 w-full py-2 text-lg bg-[#839f9099] mt-10 text-white">
          Go Back to Website
        </button>
      </Link>
    </div>
  );
};

export default AdminSidebar;
