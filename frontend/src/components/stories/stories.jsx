import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { useCurrency } from "../../context/CurrencyContext";

SwiperCore.use([Navigation]);

const Stories = () => {
  const [stories, setStories] = useState([]);
  const { selectedCurrency } = useCurrency();

  useEffect(() => {
    fetch("https://test-originale.onrender.com/story/all")
      .then((res) => res.json())
      .then((data) => setStories(data));
  }, []);

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <section className="relative stories py-[1.25rem]">
      <hr className="h-[0.11rem] border-t-0 bg-[#dcdcdc3d] opacity-[0.21]" />
      <div className=" px-6 lg:px-[7rem] pt-[2.13rem] pb-[3rem]">
        <div className="flex items-center justify-between mb-[2.3rem]">
          <h2 className="text-white text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center courierNew">
            Stories
          </h2>
          <div className="flex items-center border-b-[0.125rem] border-white">
            <Link
              to={`/${countryRoute}/story`}
              className="text-white text-sm xl:text-[1.06rem] font-bold leading-[77.5%] tracking-[0.01rem] uppercase mb-1 courierNew"
            >
              See All
            </Link>
            <span className="ml-1 mb-1 text-white">
              <MdOutlineArrowForwardIos />
            </span>
          </div>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          modules={[Navigation]}
          className="mySwiper stories h-[500px] xl:h-[420px]"
        >
          {stories?.stories?.map((story, index) => (
            <SwiperSlide key={index}>
              <Link
                key={index}
                className="z-50 "
                to={`/${countryRoute}/story/${story._id}`}
              >
                <div className="story">
                  <div className="relative ">
                    <img
                      src={story?.image}
                      alt={story?.title}
                      className="xl:w-[80%] 3xl:pl-24 w-full h-[300px] xl:h-[250px] object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="xl:absolute z-10 xl:-right-32 block px-6 py-8 w-[90%] h-full left-0 right-0 mx-auto absolute top-1/3 xl:top-16 xl:w-[60%] bg-white">
                    <h1 className="mb-4 euroWide text-[1.75rem] font-bold leading-tight text-gray-900 lg:mb-6 lg:text-4xl line-clamp-2 uppercase">
                      {story?.title}
                    </h1>
                    <p className="text-sm -mt-4 font-bold  ">
                      By The Version Originale |{" "}
                      {new Date(story.date).toDateString()}
                    </p>
                    <p
                      className="lead mb-4 line-clamp-5"
                      dangerouslySetInnerHTML={{ __html: story?.content }}
                    ></p>
                    <span className="text-lg  font-semibold  underline uppercase">
                      read more
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <hr className="h-[0.11rem] border-t-0 bg-[#dcdcdc3d] opacity-[0.21]" />
    </section>
  );
};

export default Stories;
