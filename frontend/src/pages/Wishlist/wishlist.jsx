import { useEffect, useState, useRef } from "react";
import {
  LiaLongArrowAltLeftSolid,
  LiaLongArrowAltRightSolid,
} from "react-icons/lia";
import { MdOutlineClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";

SwiperCore.use([Navigation]);

const Wishlist = () => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [swiper, setSwiper] = useState(null);
  const [wishlistArray, setWishlistArray] = useState([]);
  const { selectedCurrency } = useCurrency();

  const removeItem = (id, cart) => {
    const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedWishlist = currentWishlist.filter(
      (product) => product.item?._id !== id // Use _id for comparison
    );
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistArray(updatedWishlist); // Update the state to reflect the changes
    if (cart) {
      toast.success("Item Added To Cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000, // You can adjust the auto-close duration
      });
    }
    toast.success("Item removed from wishlist", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000, // You can adjust the auto-close duration
    });
  };

  const handleAddToCart = (item) => {
    try {
      fetch("https://test-originale.onrender.com/addtocart", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(item),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            removeItem(item.item?._id, "cart");
          } else {
            toast.warn("Please Change Currency");
          }
        });
    } catch (err) {
      console.log(err);
    } finally {
      console.log("added to card");
    }
  };

  useEffect(() => {
    if (swiper) {
      swiper.navigation.prevEl = navigationPrevRef.current;
      swiper.navigation.nextEl = navigationNextRef.current;
    }
  }, [swiper]);

  useEffect(() => {
    const getWishlist = () => {
      const wishlistJSON = localStorage.getItem("wishlist");
      const wishlistArray = JSON.parse(wishlistJSON) || [];
      return wishlistArray;
    };
    const wishlist = getWishlist();
    setWishlistArray(wishlist);
  }, []);

  if (!wishlistArray) {
    return <div>Loading...</div>;
  }
  return (
    <section className="relative">
      <ToastContainer />
      <div className="container py-8 xl:pt-[5.62rem] xl:pb-[4.69rem] xl:px-[13.5rem]">
        <div className="xl:w-[54rem]">
          <h2 className="text-[#fff] text-[1.25rem] font-bold leading-[122.5%] tracking-[0.013rem] uppercase euroWide">
            Wishlist
          </h2>
        </div>
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          // loop={true}
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
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          modules={[Navigation]}
          className="mySwiper mt-[2.5rem]"
        >
          {wishlistArray?.map((product, index) => (
            <SwiperSlide
              className="w-full   border-[1.76px] border-[#B7B8B5]/20 py-[0.69rem] px-[0.63rem] sm:px-[1.1rem] sm:max-h-[356px] relative lg:max-h-[469px] sm:py-[0.99rem]"
              key={index}
            >
              <div className="flex flex-col items-start gap-[1.06rem]">
                <div className="max-h-[193px] flex justify-center  w-full sm:max-h-[226px] lg:max-h-[352px]  overflow-hidden">
                  <img
                    src={product.item.productImage[0]}
                    alt={product.item.productName}
                    className="w-full h-[193px] sm:h-[226px] lg:h-[270px]   object-cover object-top"
                  />
                </div>
                <div className="product-shortDetails mt-[1.5rem]">
                  <h3 className="text-[#f3f3f3] text-[0.7rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide">
                    {product.item?.productName}
                  </h3>
                  <div className="product-priceCart flex items-center justify-between mt-[0.5rem]">
                    <span className="text-[#fff] text-[0.75rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide ">
                      {selectedCurrency === "BDT" ? (
                        <p>BDT {product.item?.bdPrice}</p>
                      ) : (
                        <p> AED {product.item?.dubaiPrice}</p>
                      )}
                    </span>
                  </div>
                  <div className="flex w-full items-center mt-[1.45rem] justify-between">
                    <Link
                      onClick={() => handleAddToCart(product)}
                      className="flex justify-center items-center w-full h-[3.5rem] p-[0.63rem] gap-[0.63rem] border border-white/20 uppercase text-white text-[1.06rem] font-bold leading-[77.5%] tracking-[0.01rem] px-4 courierNew  "
                    >
                      add to cart
                    </Link>
                    <Link
                      to="#"
                      className="flex pl-8 justify-center items-center h-[2.75rem] py-[0.63rem] pr-[0.63rem] gap-[0.63rem] text-red-500 text-[1.06rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
                      onClick={() => removeItem(product.item?._id)}
                    >
                      <MdOutlineClose size={20} />
                      Remove
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        ref={navigationPrevRef}
        className=" hidden xl:block absolute top-1/2 left-28 cursor-pointer"
      >
        <LiaLongArrowAltLeftSolid size={40} />
      </div>
      <div
        ref={navigationNextRef}
        className="hidden xl:block  absolute top-1/2 right-28 cursor-pointer"
      >
        <LiaLongArrowAltRightSolid size={40} />
      </div>
    </section>
  );
};

export default Wishlist;
