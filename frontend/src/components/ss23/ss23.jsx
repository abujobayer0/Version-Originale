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

const Ss23 = () => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [swiper, setSwiper] = useState(null);
  const { selectedCurrency } = useCurrency();

  useEffect(() => {
    if (swiper) {
      swiper.navigation.prevEl = navigationPrevRef.current;
      swiper.navigation.nextEl = navigationNextRef.current;
    }
  }, [swiper]);

  const { isLoding, products } = useProductContext();
  if (isLoding) {
    return (
      <div className="loader-container">
        <div className="loader">....Loading</div>
      </div>
    );
  }

  const ss23 = products.filter((curElem) => curElem.category === "Ss23");

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <section className="relative">
      <div className=" px-6 lg:px-[6rem] xl:px-[12rem] pt-[2.13rem] pb-[3rem]">
        <div className="flex items-center justify-between mb-[2.3rem]">
          <h2 className="text-[#2c332e] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center">
            SS 23
          </h2>
          <div className="flex items-center border-b-[0.125rem] border-[#191E1B]">
            <Link
              to={`/${countryRoute}/ss23`}
              className="text-[#191E1B] text-sm xl:text-[1.06rem] font-bold leading-[77.5%] tracking-[0.01rem] uppercase mb-1 courierNew"
            >
              See All
            </Link>
            <span className="ml-1 mb-1">
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
            setTimeout(() => {
              setSwiper(swiper);
            });
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          loop={true}
          grabCursor={true}
          modules={[Navigation]}
          className="mySwiper latestDrop"
        >
          {ss23.map((product, index) => (
            <SwiperSlide
              className="w-full h-full border-[1.76px] border-[#B7B8B5] py-[0.69rem] px-[0.63rem] sm:px-[1.1rem] sm:py-[0.99rem]"
              key={index}
            >
              <Link
                to={`/${countryRoute}/product/${product._id}`}
                className="flex flex-col items-start gap-[1.06rem]"
              >
                <img
                  src={product.productImage}
                  className="w-full max-h-[350px] sm:max-h-[226px] lg:max-h-[352px] object-cover "
                  alt={product.productName}
                  loading="lazy"
                />
                <div className="details">
                  <h3 className="text-[#494747] text-[.65rem] sm:text-[.88rem] font-bold leading-[122.5%] line-clamp-1 tracking-[0.009rem] euroWide">
                    {product.productName}
                  </h3>
                  <p className="text-[#4E8142] text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide mt-[0.56rem]">
                    {selectedCurrency === "BDT" ? (
                      <p>BDT {product?.bdPrice}</p>
                    ) : (
                      <p>AED {product?.dubaiPrice}</p>
                    )}
                  </p>
                </div>{" "}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        ref={navigationPrevRef}
        className="hidden xl:block absolute top-1/2 left-28 cursor-pointer"
      >
        <LiaLongArrowAltLeftSolid size={40} />
      </div>
      <div
        ref={navigationNextRef}
        className="hidden xl:block absolute top-1/2 right-28 cursor-pointer"
      >
        <LiaLongArrowAltRightSolid size={40} />
      </div>
      <hr className="h-[0.10938rem] border-t-0 bg-black opacity-[0.21]" />
    </section>
  );
};

export default Ss23;
