import { useProductContext } from "../../context/productContext";
import Product from "../../components/product/product";
import Filter from "../../components/filter/filter";
import Sort from "../../components/filter/sort";
import MobileFilter from "../../components/filter/mobileFilter";
import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";

const LatestDrops = () => {
  const { isLoading, products } = useProductContext();
  const [newProducts, setNewProducts] = useState(products);
  const [sizes, setSizes] = useState([]);

  // Calculate the date 30 days ago from today
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentProducts = newProducts.filter((product) => {
    const productDate = new Date(product.date);
    return productDate >= thirtyDaysAgo && productDate <= currentDate;
  });

  const productsToShow =
    recentProducts.length > 0 ? recentProducts : products.slice(-16);
  const handleSizes = (sz) => {
    setSizes(sz);
  };
  const handleRequest = async (filterQuery) => {
    try {
      const queryParams = new URLSearchParams(filterQuery);
      console.log("filterQuery:", filterQuery);
      const response = await fetch(
        `https://test-originale.onrender.com/filter?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      if (sizes.length > 0) {
        if (responseData && responseData) {
          const filteredProducts = responseData.filter((product) => {
            const sizesValue = JSON.parse(product.sizesValue);
            return sizes.some(
              (size) => sizesValue[size] !== undefined && sizesValue[size] > 0
            );
          });
          setNewProducts(filteredProducts);
        }
      } else {
        setNewProducts(responseData);
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      // setIsFetching(false);
    }
  };
  const handleRequestSort = async (data) => {
    const query = data;
    try {
      const queryParams = new URLSearchParams(query);
      const response = await fetch(
        `https://test-originale.onrender.com/sort/filter?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNewProducts(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      // setIsFetching(false);
    }
  };
  const handleMobileFilter = async (data) => {
    const query = data;
    try {
      // setIsFetching(true);
      const queryParams = new URLSearchParams(query);
      const response = await fetch(
        `https://test-originale.onrender.com/filter/mobile?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      if (sizes.length > 0) {
        if (responseData && responseData) {
          const filteredProducts = responseData.filter((product) => {
            const sizesValue = JSON.parse(product.sizesValue);
            return sizes.some(
              (size) => sizesValue[size] !== undefined && sizesValue[size] > 0
            );
          });
          setNewProducts(filteredProducts);
        }
      } else {
        setNewProducts(responseData);
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      // setIsFetching(false);
    }
  };
  useEffect(() => {
    if (products && !isLoading) {
      setNewProducts(products);
    }
  }, [products]);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      <div className=" px-6 lg:px-[7rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem]">
        <MobileFilter
          handleSizes={handleSizes}
          handleMobileFilter={handleMobileFilter}
          Page={"new-drop"}
        />
        <div className="mb-[1.3rem] md:mb-[1.5rem] flex items-center justify-between">
          <Filter
            handleRequest={handleRequest}
            handleSizes={handleSizes}
            Page={"new-drop"}
          />
          <h2 className="text-[#fff] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide text-center mx-auto">
            Latest Drop
          </h2>
          <Sort handleRequestSort={handleRequestSort} Page={"new-drop"} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-[12px] md:gap-[20px]">
          {productsToShow.map((curElem) => {
            return <Product key={curElem.id} {...curElem} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestDrops;
