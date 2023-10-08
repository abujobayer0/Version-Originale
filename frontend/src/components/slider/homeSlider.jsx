import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, Parallax } from "swiper/modules";
import SwiperCore from "swiper";
import { useCurrency } from "../../context/CurrencyContext";
SwiperCore.use([Pagination, Autoplay]);
export default function HomeSlider() {
  const { selectedCurrency } = useCurrency();
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  return (
    <section className="homeSlider-container  relative">
      <Swiper
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={true}
        effect="fade"
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className} custom-pagination-item"></span>`;
          },
        }}
        className="mySwiper h-[630px] xl:h-[765px]"
      >
        <SwiperSlide className="slider-1 px-6 bg-[#BDCBC5] relative overflow-x-hidden">
          <img
            src={"https://i.postimg.cc/N0cW23Gg/slider-1.webp"}
            alt=""
            className="absolute top-0 left-0 xl:left-[50px] h-[400px] xl:h-[765px] object-cover -z-10 slider-img w-full"
            loading="lazy"
          />

          <div className=" xl:pl-[7.56rem]">
            <div className="w-[20.125rem] xl:w-[29rem] flex flex-col gap-[2.06rem] mt-[350px] xl:mt-[200px]">
              <h1 className="main-text">
                Level up your look with our newest collection
              </h1>
              <p className="slider-excerpt">
                Step up your summer style game with our fresh and fashionable
                threads!
              </p>
              <Link to={`/${countryRoute}/collections`} className="slider-btn">
                Shop Collection
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="slider-1 px-6 bg-[#dfd9bf] relative overflow-x-hidden">
          <img
            src={"https://i.postimg.cc/ncwF7cNn/slider-2.webp"}
            alt=""
            className="absolute top-0 left-0 xl:left-[50px] h-[400px] xl:h-[765px] object-cover -z-10 slider-img w-full"
            loading="lazy"
          />

          <div className=" xl:pl-[7.56rem]">
            <div className="w-[20.125rem] xl:w-[29rem] flex flex-col gap-[2.06rem] mt-[350px] xl:mt-[200px]">
              <h1 className="main-text">
                Level up your look with our newest collection
              </h1>
              <p className="slider-excerpt">
                Step up your summer style game with our fresh and fashionable
                threads!
              </p>
              <Link to={`/${countryRoute}/collections`} className="slider-btn">
                Shop Collection
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="custom-pagination"></div>
    </section>
  );
}
