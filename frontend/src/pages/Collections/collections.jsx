import { useEffect, useState } from "react";
import { useGetPaginationData } from "../../customHooks/useGetPaginationData/useGetPaginationData";
import Product from "../../components/product/product";
import Filter from "../../components/filter/filter";
import Sort from "../../components/filter/sort";
import MobileFilter from "../../components/filter/mobileFilter";

const Collections = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sizes, setSizes] = useState([]);
  const { data: productData, isLoading } = useGetPaginationData(
    "/products/all",
    currentPage
  );

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 400 &&
        !isLoading &&
        currentPage < productData?.pageNumbers.length
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, currentPage, productData?.pageNumbers.length]);
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
          setProducts(filteredProducts);
        }
      } else {
        setProducts(responseData);
      }
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
          setProducts(filteredProducts);
        }
      } else {
        setProducts(responseData);
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
      // setIsFetching(true);
      const queryParams = new URLSearchParams(query);
      const response = await fetch(
        `https://test-originale.onrender.com/sort/filter?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      // setIsFetching(false);
    }
  };

  useEffect(() => {
    if (productData?.products) {
      setProducts((prevProducts) => [...prevProducts, ...productData.products]);
    }
  }, [productData?.products]);

  return (
    <section>
      <div className=" min-h-screen px-6 md:px-[3rem] xl:px-[4rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem]">
        <MobileFilter
          Page={"collections"}
          handleSizes={handleSizes}
          handleMobileFilter={handleMobileFilter}
        />
        <div className="mb-[1.3rem] md:mb-[1.5rem] flex items-center justify-between">
          <Filter
            handleSizes={handleSizes}
            handleRequest={handleRequest}
            Page={"collections"}
          />
          <h2 className="text-[#fff] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide text-center">
            Collections
          </h2>
          <Sort handleRequestSort={handleRequestSort} Page={"collections"} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-[12px] md:gap-[20px]">
          {products?.map((curElem) => {
            return <Product key={curElem.id} {...curElem} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Collections;
