import { useCurrency } from "../../context/CurrencyContext";
import { useProductContext } from "../../context/productContext";
import Product from "../../components/product/product";
import Filter from "../../components/filter/filter";
import Sort from "../../components/filter/sort";
import MobileFilter from "../../components/filter/mobileFilter";
import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import { Link } from "react-router-dom";
import img from "../../assets/img/homeBanner.webp";
import img2 from "../../assets/img/homeBanner-2.webp";

const Fw23 = () => {
  const { isLoading, products } = useProductContext();
  const { selectedCurrency } = useCurrency();
  const [sizes, setSizes] = useState([]);
  const handleSizes = (sz) => {
    setSizes(sz);
  };
  const [productsToShow, setProductToShow] = useState([]);
  const filterProducts = (products) => {
    return products.filter((product) => product.category === "Fw23");
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
      setProductToShow(data?.filter((curElem) => curElem.category === "Fw23"));
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
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  useEffect(() => {
    if (products && !isLoading) {
      setProductToShow(
        products.filter((curElem) => curElem.category === "Fw23")
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
      <div>
        <div className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <article className="relative">
              <figure className="relative m-auto overflow-hidden w-full">
                <img
                  src={img}
                  alt="Banner-1"
                  className="w-full max-w-full transition-all duration-300 ease-linear block h-auto md:h-[500px] xl:h-[600px] 3xl:h-[650px] scale-100 object-cover bg-top hover:scale-110"
                  loading="lazy"
                />
              </figure>
              <figcaption
                className="absolute top-[47%] left-[50%]
                            transform translate-x-[-50%] translate-y-[-50%] text-center w-full inline-flex flex-col items-center gap-6"
              >
                <h2 className="text-white text-[2.56rem] font-bold leading-[77.5%] tracking-[0.0026rem] euroWide">
                  Artistic
                </h2>
                <Link
                  to={`/${countryRoute}/ss23/artistic`}
                  className="border-2 border-white text-white inline-flex justify-center items-center w-[13rem] h-[3rem] p-[.5rem] gap-[.5rem] text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
                >
                  Shop Collection
                </Link>
              </figcaption>
            </article>
            <article className="relative">
              <figure className="relative m-auto overflow-hidden w-full">
                <img
                  src={img2}
                  alt="Banner-2"
                  className="w-full max-w-full transition-all duration-300 ease-linear block h-auto md:h-[500px] xl:h-[600px] 3xl:h-[650px]  scale-100 object-cover bg-top hover:scale-110"
                  loading="lazy"
                />
              </figure>
              <figcaption
                className="absolute top-[47%] left-[50%]
                            transform translate-x-[-50%] translate-y-[-50%] text-center w-full inline-flex flex-col items-center gap-6"
              >
                <h2 className="text-white text-[2.56rem] font-bold leading-[77.5%] tracking-[0.0026rem] euroWide">
                  Cartoonish
                </h2>
                <Link
                  to={`/${countryRoute}/ss23/cartoonish`}
                  className="border-2 border-white text-white inline-flex justify-center items-center w-[13rem] h-[3rem] p-[.5rem] gap-[.5rem] text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
                >
                  Shop Collection
                </Link>
              </figcaption>
            </article>
          </div>
        </div>
        <div className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <article className="relative">
              <figure className="relative m-auto overflow-hidden w-full">
                <img
                  src={img}
                  alt="Banner-1"
                  className="w-full max-w-full transition-all duration-300 ease-linear block h-auto md:h-[500px] xl:h-[600px] 3xl:h-[650px] scale-100 object-cover bg-top hover:scale-110"
                  loading="lazy"
                />
              </figure>
              <figcaption
                className="absolute top-[47%] left-[50%]
                            transform translate-x-[-50%] translate-y-[-50%] text-center w-full inline-flex flex-col items-center gap-6"
              >
                <h2 className="text-white text-[2.56rem] font-bold leading-[77.5%] tracking-[0.0026rem] euroWide">
                  Anime
                </h2>
                <Link
                  to={`/${countryRoute}/ss23/anime`}
                  className="border-2 border-white text-white inline-flex justify-center items-center w-[13rem] h-[3rem] p-[.5rem] gap-[.5rem] text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
                >
                  Shop Collection
                </Link>
              </figcaption>
            </article>
            <article className="relative">
              <figure className="relative m-auto overflow-hidden w-full">
                <img
                  src={img2}
                  alt="Banner-2"
                  className="w-full max-w-full transition-all duration-300 ease-linear block h-auto md:h-[500px] xl:h-[600px] 3xl:h-[650px]  scale-100 object-cover bg-top hover:scale-110"
                  loading="lazy"
                />
              </figure>
              <figcaption
                className="absolute top-[47%] left-[50%]
                            transform translate-x-[-50%] translate-y-[-50%] text-center w-full inline-flex flex-col items-center gap-6"
              >
                <h2 className="text-white text-[2.56rem] font-bold leading-[77.5%] tracking-[0.0026rem] euroWide">
                  Retro
                </h2>
                <Link
                  to={`/${countryRoute}/ss23/retro`}
                  className="border-2 border-white text-white inline-flex justify-center items-center w-[13rem] h-[3rem] p-[.5rem] gap-[.5rem] text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
                >
                  Shop Collection
                </Link>
              </figcaption>
            </article>
          </div>
        </div>
      </div>
      <div className=" px-6 lg:px-[6rem] xl:px-[12rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem]">
        <MobileFilter
          handleSizes={handleSizes}
          handleMobileFilter={handleMobileFilter}
          Page={"fw23"}
        />
        <div className="mb-[1.3rem] md:mb-[1.5rem] flex items-center justify-between">
          <Filter
            handleRequest={handleRequest}
            handleSizes={handleSizes}
            Page={"fw23"}
          />
          <h2 className="text-[#fff] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide text-center">
            FW 23
          </h2>
          <Sort handleRequestSort={handleRequestSort} Page={"fw23"} />
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

export default Fw23;
