import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import {
  LiaLongArrowAltLeftSolid,
  LiaLongArrowAltRightSolid,
} from "react-icons/lia";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
SwiperCore.use([Navigation]);

import { useProductContext } from "../../context/productContext";
import { useCurrency } from "../../context/CurrencyContext";

const NewDropComp = () => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [swiper, setSwiper] = useState(null);
  const { selectedCurrency } = useCurrency();
  const { isLoding, products } = useProductContext();

  useEffect(() => {
    if (swiper) {
      swiper.navigation.prevEl = navigationPrevRef.current;
      swiper.navigation.nextEl = navigationNextRef.current;
    }
  }, [swiper]);

  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentProducts = products.filter((product) => {
    const productDate = new Date(product.date);
    return productDate >= thirtyDaysAgo && productDate <= currentDate;
  });

  const latestProducts = recentProducts.slice(-12);

  const productsToShow =
    latestProducts.length > 0
      ? latestProducts
      : products.sort(() => Math.random() - 0.5).slice(0, 12);

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  if (isLoding) {
    return (
      <div className="loader-container">
        <div className="loader">....Loading</div>
      </div>
    );
  }
  const slideHeight = 300;

  return (
    <section className="relative ">
      <hr className="h-[0.10938rem] border-t-0 bg-black opacity-[0.21]" />
      <div className=" m-0  px-6 lg:px-[4rem] pt-[2.13rem] pb-[3rem]">
        <div className="flex items-center justify-between mb-[2.3rem]">
          <h2 className="text-[#fff] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center">
            Latest Drop
          </h2>
          <div className="flex items-center border-b-[0.125rem] border-[#fff]">
            <Link
              to={`/${countryRoute}/new-drop`}
              className="text-[#fff] text-sm xl:text-[1.06rem] font-bold leading-[77.5%] tracking-[0.01rem] uppercase mb-1 courierNew"
            >
              See All
            </Link>
            <span className="ml-1 text-white mb-1">
              <MdOutlineArrowForwardIos />
            </span>
          </div>
        </div>
        <Swiper
          slidesPerView={2}
          spaceBetween={12}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {});
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1201: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          modules={[Navigation]}
          style={{ height: "fit-content" }}
          className="mySwiper latestDrop"
        >
          {productsToShow.map((product, index) => (
            <SwiperSlide key={index}>
              <Link
                to={`/${countryRoute}/product/${product?._id}`}
                className="w-full h-full"
              >
                <div className="group border-[1.76px]  border-[#fff]/20 my-10  flex w-full  flex-col overflow-hidden  shadow-md">
                  <a
                    className="relative mx-3 mt-3 flex h-52 lg:h-72 overflow-hidden "
                    href="#"
                  >
                    <img
                      className="peer absolute aspect-square top-0 right-0 h-full w-full object-top object-cover"
                      src={product?.resizedImages[0]}
                      alt="product image"
                      loading="lazy"
                    />
                    <img
                      className="peer absolute aspect-square top-0 -right-96 h-full w-full object-top object-cover transition-all delay-100 duration-1000 hover:right-0 peer-hover:right-0"
                      src={product?.resizedImages[1]}
                      alt="product image"
                      loading="lazy"
                    />

                    <svg
                      className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto text-3xl text-white  transition-opacity group-hover:animate-ping group-hover:opacity-30 peer-hover:opacity-0"
                      xmlns="http://www.w3.org/2000/svg"
                      ariaHidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M2 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v10a4 4 0 0 1-2.328 3.635a2.996 2.996 0 0 0-.55-.756l-8-8A3 3 0 0 0 14 17v7H6a4 4 0 0 1-4-4V10Zm14 19a1 1 0 0 0 1.8.6l2.7-3.6H25a1 1 0 0 0 .707-1.707l-8-8A1 1 0 0 0 16 17v12Z"
                      />
                    </svg>
                    {product?.stock === "unavailable" && (
                      <div className="bg-red-500 text-white font-bold py-1 px-2  absolute top-2 right-2">
                        Stock Out
                      </div>
                    )}
                  </a>
                  <div className="mt-4  px-5 pb-0">
                    <a href="#">
                      <h3 className="text-[#fff] text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] line-clamp-1 tracking-[0.009rem] euroWide">
                        {product?.productName}{" "}
                      </h3>
                    </a>
                    <div className="mb-5 relative flex items-center justify-between">
                      <p className="flex items-center  gap-2 text-[#fff] text-opacity-70  text-[.75rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ">
                        {product?.bdPriceSale !== 0 &&
                          product?.dubaiPrice !== 0 && (
                            <p className="text-[#fff] text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide ">
                              {selectedCurrency === "BDT" ? (
                                <p className="text-[#fff] text-opacity-70  whitespace-nowrap text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide ">
                                  BDT {product?.bdPriceSale}
                                </p>
                              ) : (
                                <p className="text-[#fff] text-opacity-70  text-[.65rem] whitespace-nowrap sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ">
                                  AED {product?.dubaiPriceSale}
                                </p>
                              )}
                            </p>
                          )}{" "}
                        <p
                          className={`text-[#fff] text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ${
                            product?.bdPriceSale && product?.dubaiPriceSale
                              ? "line-through sm:text-[.60rem] absolute -bottom-3 sm:relative sm:bottom-0 "
                              : ""
                          }`}
                        >
                          {selectedCurrency === "BDT" ? (
                            <p className="whitespace-nowrap">
                              BDT {product?.bdPrice}
                            </p>
                          ) : (
                            <p className="whitespace-nowrap">
                              AED {product?.dubaiPrice}
                            </p>
                          )}
                        </p>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        ref={navigationPrevRef}
        className="hidden text-white xl:block absolute top-1/2 left-10 cursor-pointer"
      >
        <LiaLongArrowAltLeftSolid size={40} />
      </div>
      <div
        ref={navigationNextRef}
        className="hidden xl:block text-white absolute top-1/2 right-10 cursor-pointer"
      >
        <LiaLongArrowAltRightSolid size={40} />
      </div>
      <hr className="h-[0.10938rem] border-t-0 bg-black opacity-[0.21]" />
    </section>
  );
};

export default NewDropComp;
