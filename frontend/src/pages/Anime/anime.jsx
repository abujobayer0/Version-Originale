import { useEffect, useState } from "react";
import { useProductContext } from "../../context/productContext";
import Product from "../../components/product/product";
import Filter from "../../components/filter/filter";
import Sort from "../../components/filter/sort";
import MobileFilter from "../../components/filter/mobileFilter";
import Loader from "../../components/loader/Loader";

const Anime = () => {
  const { isLoading, products } = useProductContext();
  const [sizes, setSizes] = useState([]);
  const handleSizes = (sz) => {
    setSizes(sz);
  };
  const [productsToShow, setProductToShow] = useState([]);
  const filterProducts = (products) => {
    return products.filter((product) => product.category === "Ss23");
  };
  const handleRequest = async (data) => {
    const query = data;
    console.log(data);
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
          setProductToShow(filterProducts(filteredProducts));
        }
      } else {
        setProductToShow(filterProducts(responseData));
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
      setProductToShow(
        data?.filter((curElem) => curElem.subCategory === "Anime")
      );
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
          setProductToShow(filterProducts(filteredProducts));
        }
      } else {
        setProductToShow(filterProducts(responseData));
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      // setIsFetching(false);
    }
  };
  useEffect(() => {
    if (products && !isLoading) {
      setProductToShow(
        products.filter((curElem) => curElem.subCategory === "Anime")
      );
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
    <section>
      <div className=" px-6 lg:px-[4rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem]">
        <MobileFilter
          handleSizes={handleSizes}
          handleMobileFilter={handleMobileFilter}
          Page={"ss23"}
        />
        <div className="mb-[1.3rem] md:mb-[1.5rem] flex items-center justify-between">
          <Filter
            handleSizes={handleSizes}
            handleRequest={handleRequest}
            Page={"ss23"}
          />
          <h2 className="text-[#fff] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide text-center">
            Anime
          </h2>
          <Sort handleRequestSort={handleRequestSort} Page={"ss23"} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-[12px] md:gap-[20px]">
          {productsToShow?.map((curElem) => {
            return <Product key={curElem._id} {...curElem} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Anime;
