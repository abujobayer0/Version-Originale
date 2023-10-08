import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { EffectCreative, Navigation } from "swiper/modules";
import { useCurrency } from "../../context/CurrencyContext";

const RockyProcduct = () => {
  const { selectedCurrency } = useCurrency();

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <section className="rocky-section relative">
      <Swiper
        navigation={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        grabCursor={true}
        effect={"creative"}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        modules={[EffectCreative, Navigation]}
        className="mySwiper rockySlider"
      >
        <SwiperSlide className="rocky-slider-1">
          <div
            className=" px-6 lg:px-[6rem] xl:px-[12rem] pt-[5.89rem] pb-[3.16rem] xl:pb-[4.16rem] flex flex-col   justify-center items-center top-[50%] left-[50%]
                    transform translate-y-[35%] lg:translate-y-[50%]"
          >
            <h2 className="text-white text-center text-[1.56rem] lg:text-[2.56rem] font-bold leading-[77.5%] tracking-[0.023rem] uppercase euroWide">
              Version Originale x A$AP ROCKY
            </h2>
            <Link
              to={`/${countryRoute}/collections`}
              className="mt-[1.5rem] lg:mt-[2.5rem] flex items-center justify-center w-[13rem] p-[0.63rem] gap-[0.63rem] bg-white text-black text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew mx-auto"
            >
              Shop Collection
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide className="rocky-slider-2">
          {" "}
          <div
            className=" px-6 lg:px-[6rem] xl:px-[12rem] pt-[5.89rem] pb-[3.16rem] xl:pb-[4.16rem] flex flex-col   justify-center items-center top-[50%] left-[50%]
                    transform translate-y-[35%] lg:translate-y-[50%]"
          >
            <h2 className="text-white text-center text-[1.56rem] lg:text-[2.56rem] font-bold leading-[77.5%] tracking-[0.023rem] uppercase euroWide">
              Version Originale x A$AP ROCKY
            </h2>
            <Link
              to={`/${countryRoute}/collections`}
              className="mt-[1.5rem] lg:mt-[2.5rem] flex items-center justify-center w-[13rem] p-[0.63rem] gap-[0.63rem] bg-white text-black text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew mx-auto"
            >
              Shop Collection
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default RockyProcduct;
