import { useEffect, useState } from "react";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Filter from "../../components/filter/filter";
import Sort from "../../components/filter/sort";
import MobileFilter from "../../components/filter/mobileFilter";
import Loader from "../../components/loader/Loader";
import BestSellingCard from "../../components/bestSellingCard/bestSellingCard";

const MostWanted = () => {
  const { data: products, isLoading } = useGetData("/featured");
  const [productsToShow, setProductToShow] = useState([]);
  const [sizes, setSizes] = useState([]);

  const filterFeaturedProducts = (products) => {
    return products.filter((product) => product.featured === true);
  };
  const handleSizes = (sz) => {
    setSizes(sz);
  };
  const handleRequest = async (data) => {
    const query = data;
    try {
      const queryParams = new URLSearchParams(query);
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
          setProductToShow(filterFeaturedProducts(filteredProducts));
        }
      } else {
        setProductToShow(filterFeaturedProducts(responseData));
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
      setProductToShow(filterFeaturedProducts(data));
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      // setIsFetching(false);
    }
  };

  const handleMobileFilter = async (data) => {
    const query = data;
    try {
      const queryParams = new URLSearchParams(query);
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
          setProductToShow(filterFeaturedProducts(filteredProducts));
        }
      } else {
        setProductToShow(filterFeaturedProducts(responseData));
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      // setIsFetching(false);
    }
  };
  useEffect(() => {
    if (products && !isLoading) {
      setProductToShow(filterFeaturedProducts(products));
    }
  }, [products]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bestSelling">
      <div className=" min-h-screen px-6 lg:px-[4rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem] ">
        <MobileFilter
          bestSelling
          handleSizes={handleSizes}
          handleMobileFilter={handleMobileFilter}
          Page={"featured"}
        />
        <div className="flex items-center justify-between mb-[2.3rem]">
          <Filter
            bestSelling
            handleSizes={handleSizes}
            handleRequest={handleRequest}
            Page={"featured"}
          />
          <h2 className="text-white text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center">
            Best Selling🔥
          </h2>
          <Sort
            bestSelling
            handleRequestSort={handleRequestSort}
            Page={"featured"}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-[12px] md:gap-[20px]">
          {productsToShow?.map((curElem) => {
            return <BestSellingCard key={curElem.id} {...curElem} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default MostWanted;
