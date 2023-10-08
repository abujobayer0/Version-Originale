import { useEffect, useState, useRef, Fragment } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import { Mousewheel, Pagination } from "swiper/modules";
import Product from "../../components/product/product";
import { FiMinus, FiPlus } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaLink,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import SizeGuideImg from "../../assets/size_guide/product_size_guide.png";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import app from "../../firebase/firebase.config";
import SidebarCart from "../../components/sidebarCart/sidebarCart";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { useCurrency } from "../../context/CurrencyContext";
import { LiaGalacticRepublic } from "react-icons/lia";
import RelatedProductCard from "../../components/relatedProductCard/relatedProductCard";

const auth = getAuth(app);

const SingleProduct = () => {
  const { _id } = useParams();
  const [singleData, setSingleData] = useState({});
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { selectedCurrency } = useCurrency();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const swiperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [isCartBarOpen, setIsCartBarOpen] = useState(false);
  const { data: cartItems, isLoading, refetch } = useGetData(
    `/cart/item?email=${user?.email}`
  );
  const navigate = useNavigate();

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  function closeModal() {
    setIsOpen(false);
  }

  function handleSizeGuide() {
    setIsOpen(true);
  }

  useEffect(() => {
    axios
      .get(`https://test-originale.onrender.com/newProduct/${_id}`)
      .then((res) => {
        setSingleData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [_id]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const copyLinkToClipboard = () => {
    const productLink = window.location.href;
    navigator.clipboard.writeText(productLink);
    toast.success("Link copied to clipboard!");
  };

  const shareOnFacebook = () => {
    const productLink = window.location.href;
    const shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productLink
    )}`;
    window.open(shareURL, "_blank");
  };
  const shareOnInstagram = async (accessToken, mediaUrl, caption) => {
    try {
      // Make a POST request to Instagram API to share content
      const response = await fetch(
        `https://graph.instagram.com/v12.0/me/media?media_url=${mediaUrl}&caption=${caption}&access_token=${accessToken}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        console.log("Shared on Instagram successfully");
      } else {
        console.error("Failed to share on Instagram:", response.statusText);
      }
    } catch (error) {
      console.error("Error sharing on Instagram:", error);
    }
  };
  const shareOnTikTok = (productName) => {
    console.log("clicked");
    try {
      // Encode the product name and URL
      const encodedProductName = encodeURIComponent(productName);
      const productLink = window.location.href;
      const encodedProductURL = encodeURIComponent(productLink);
      const tiktokDeepLink = `tiktok://create?caption=${encodedProductName}&url=${encodedProductURL}`;

      // Attempt to open the TikTok deep link
      window.location.href = tiktokDeepLink;

      // If the deep link doesn't work, provide a fallback message
      setTimeout(() => {
        alert(
          "To share on TikTok, please open the TikTok app and paste the product link."
        );
      }, 3000); // Display the message after a delay
    } catch (error) {
      console.error("Error sharing on TikTok:", error);
      alert(
        "An error occurred while sharing on TikTok. Please try again later."
      );
    }
  };

  const shareViaEmail = () => {
    const subject = "Check out this product";
    const productLink = window.location.href;
    const body = `I thought you might be interested in this product: ${productLink}`;
    const mailtoURL = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoURL;
  };
  const handleThumbnailClick = (index) => {
    setActiveThumbnailIndex(index);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };
  const addToWishlist = (singleData) => {
    if (!selectedSize) {
      // Handle the case where color or size is not selected
      toast.warn("Color and size must be selected before adding to wishlist.");
      return;
    }

    const price =
      selectedCurrency === "BDT" && singleData.bdPriceSale !== 0
        ? singleData?.bdPriceSale
        : selectedCurrency === "AED" && singleData.dubaiPriceSale !== 0
        ? singleData?.dubaiPriceSale
        : selectedCurrency === "BDT" && singleData.bdPriceSale === 0
        ? singleData?.bdPrice
        : selectedCurrency === "AED" && singleData?.dubaiPrice === 0
        ? singleData.dubaiPrice
        : 0;

    const item = {
      added_by: user?.email,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      item: singleData,
      price: price,
      currency: selectedCurrency,
      img: singleData.productImage[0],
    };

    // Initialize currentWishlist as an empty array if it doesn't exist
    let currentWishlist = JSON.parse(localStorage.getItem("wishlist"));
    if (!currentWishlist) {
      currentWishlist = [];
    }

    if (item) {
      currentWishlist.push(item);
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      toast.success("Item Added to wishlist", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const openCartBar = () => {
    setIsCartBarOpen(true);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.warn("Login to Add to cart.");
      navigate(`/${countryRoute}/login`);
      return;
    }
    if (!selectedSize) {
      // Handle the case where color or size is not selected
      toast.warn("Color and size must be selected before adding to cart.");
      return;
    }
    if (!selectedColor) {
      // Handle the case where color or size is not selected
      toast.warn("Color and size must be selected before adding to cart.");
      return;
    }
    const price =
      selectedCurrency === "BDT"
        ? singleData?.bdPriceSale !== 0
          ? singleData.bdPriceSale
          : singleData?.bdPrice
        : singleData?.dubaiPriceSale !== 0
        ? singleData?.dubaiPriceSale
        : singleData?.dubaiPrice;
    const item = {
      added_by: user?.email,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      item: singleData,
      price: price,
      currency: selectedCurrency,
      img: singleData.productImage[0],
    };

    try {
      fetch("https://test-originale.onrender.com/addtocart", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(item),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.acknowledged) {
            openCartBar();
            refetch();
          } else {
            toast.warn("Please Change Currency");
          }
        });
    } catch (err) {
      console.log(err);
    } finally {
      // console.log("added to card");
    }
  };

  const closeCartBar = () => {
    setIsCartBarOpen(false);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    fetch(
      `https://test-originale.onrender.com/category/products?query=${singleData?.category}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRelatedProducts(data);
      });
  }, [singleData]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [_id]);
  let Colors;

  try {
    Colors = !isLoading && JSON.parse(singleData?.colorsValue);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    Colors = null;
  }

  return (
    <section className="bg-white w-full flex   items-center">
      <ToastContainer />
      <div className="  py-6 xl:pt-[2.87rem] w-full px-6 xl:pb-[3.06rem] ">
        <div
          className="flex flex-col  sm:flex-row-reverse xl:flex-row
                sm:flex-wrap xl:flex-nowrap xl:gap-24 2xl:gap-0 items-center md:items-start justify-around"
        >
          <div
            className={`description flex  p-4 flex-col justify-end items-start px-[1.56rem] pb-[2rem] self-start w-full sm:w-[35%] xl:w-[60rem] 2xl:w-[25rem] order-3 sm:order-1  mt-[0.88rem] `}
          >
            <h2 className="text-[#2c332e] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide xl:text-xl">
              Description
            </h2>
            <div
              style={{
                height: "58vh",
                overflow: "hidden",
                overflowY: "scroll",
              }}
              className="custom-scrollbar-description w-full p-4 overflow-y-auto"
            >
              <div className="custom-html-content helveticaNowDisplay">
                <div
                  dangerouslySetInnerHTML={{ __html: singleData?.description }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex xl:ml-[2rem] gap-4 w-full sm:w-[65%]  xl:w-[35rem] h-full order-1  sm:order-2">
            <Swiper
              ref={swiperRef}
              direction={"vertical"}
              slidesPerView={1}
              spaceBetween={20}
              mousewheel={true}
              pagination={{
                type: "progressbar",
              }}
              modules={[Mousewheel, Pagination]}
              className="mySwiper customSlider"
              onSlideChange={(swiper) => {
                setActiveThumbnailIndex(swiper.activeIndex);
              }}
              loopAdditionalSlides={1}
            >
              {singleData.productImage &&
                singleData.productImage.map((image, index) => (
                  <SwiperSlide key={index} style={{ padding: 0 }}>
                    <img
                      src={image}
                      alt={singleData.productName}
                      className="w-auto md:pr-8 h-full  object-cover"
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
            <div className=" gap-[0.70rem] thumbs-gallery">
              {singleData.productImage &&
                singleData.productImage.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={singleData.productName}
                    className={`w-20 h-20 object-cover cursor-pointer ${
                      activeThumbnailIndex === index
                        ? "opacity-1"
                        : "opacity-[0.34]"
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col mt-6  xl:ml-[2.25rem] w-full sm:w-full xl:w-[80%] 2xl:w-[30%]  order-2 sm:order-3 sm:mt-[.88rem]">
            <div className="flex flex-col  items-start p-[1.38rem] gap-[1.94rem] ">
              <h2 className="text-[#2c332e] text-left font-bold leading-[109.5%] tracking-[0.012rem] uppercase euroWide text-base xl:text-[1.25rem]">
                {singleData.productName}
              </h2>
              <h3 className="text-[#4E8142] text-left w-full text-[14px] euroWide -mt-6">
                <div className="mb-5 flex  items-center justify-between">
                  <p className="flex items-center gap-2   ">
                    {singleData?.bdPriceSale !== 0 &&
                      singleData?.dubaiPriceSale !== 0 && (
                        <p className="text-[#000] text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ">
                          {selectedCurrency === "BDT" ? (
                            <p className="text-[#4E8142] text-left w-full text-[14px] euroWide ">
                              BDT {singleData.bdPriceSale}
                            </p>
                          ) : (
                            <p className="text-[#4E8142] text-left w-full text-[14px] euroWide ">
                              AED {singleData.dubaiPriceSale}
                            </p>
                          )}{" "}
                        </p>
                      )}{" "}
                    <p
                      className={`text-[#000] text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide 
                     ${
                       singleData?.bdPriceSale && singleData?.dubaiPriceSale
                         ? "line-through sm:text-[.60rem]"
                         : ""
                     }`}
                    >
                      {selectedCurrency === "BDT" ? (
                        <p className="text-[#4E8142] text-left w-full text-[14px] euroWide ">
                          BDT {singleData.bdPrice}
                        </p>
                      ) : (
                        <p className="text-[#4E8142] text-left w-full text-[12px] euroWide ">
                          AED {singleData.dubaiPrice}
                        </p>
                      )}{" "}
                    </p>
                  </p>
                </div>
              </h3>
              <div className="color">
                <h3 className="text-[#000000C2] font-bold leading-[107%] tracking-[0.010rem] uppercase courierNew text-base">
                  Color
                </h3>
                <div className="flex items-start gap-[0.34rem] mt-[.44rem]">
                  {Array.isArray(Colors) ? (
                    Colors?.map((color, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 sm:w-[4rem] sm:h-[2.5rem] sm:rounded-none flex justify-center rounded-full items-center gap-[1.63rem]
                    ${
                      selectedColor === color?.name
                        ? "border-2 border-[#00000066]"
                        : ""
                    }
                `}
                      >
                        <button
                          className="rounded-full w-[1.5rem] border h-[1.5rem] sm:rounded-none sm:w-[3rem] cursor-pointer t-[.44rem]"
                          style={{ backgroundColor: color?.name }}
                          onClick={() => handleColorClick(color?.name)}
                        />
                      </div>
                    ))
                  ) : (
                    <div
                      className={`w-8 h-8 sm:w-[4rem] sm:h-[2.5rem] sm:rounded-none flex justify-center rounded-full items-center gap-[1.63rem]
                border-2 border-[#00000066]
            `}
                    >
                      <button
                        className="rounded-full w-[1.5rem] h-[1.5rem] sm:rounded-none sm:w-[3rem] cursor-pointer t-[.44rem]"
                        style={{ backgroundColor: Colors?.name }}
                        onClick={() => handleColorClick(Colors?.name)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="size">
                <h3 className="text-[#000000C2] font-bold leading-[107%] tracking-[0.010rem] uppercase courierNew text-base">
                  Size
                </h3>
                <div className="flex items-start gap-[0.34rem] mt-[.44rem]">
                  {singleData.sizesValue
                    ? Object.keys(JSON.parse(singleData.sizesValue)).map(
                        (sizeKey, index) => {
                          const sizeValue = JSON.parse(singleData.sizesValue)[
                            sizeKey
                          ];
                          return (
                            <button
                              key={index}
                              className={`w-10 h-10 sm:w-[4rem] flex items-center ${
                                sizeValue === 0 && "bg-gray-300"
                              } justify-center border-2 border-[#38453E40] cursor-pointer text-[#38453E] font-bold text-base leading-[77.5%] tracking-[0.01rem] uppercase courierNew ${
                                selectedSize === sizeKey
                                  ? "border-[#38453E]"
                                  : ""
                              }`}
                              onClick={() => handleSizeClick(sizeKey)}
                              disabled={sizeValue === 0}
                            >
                              {sizeKey}
                            </button>
                          );
                        }
                      )
                    : null}
                </div>

                <div className="flex items-center gap-[1.44rem] mt-[0.81rem]">
                  <div
                    onClick={handleSizeGuide}
                    className="text-[#38453E85] text-base font-bold leading-[98%] tracking-[0.01rem] underline underline-offset-4 courierNew cursor-pointer"
                  >
                    Size Guide
                  </div>
                  <Link to={"/contact"}>
                    <div className="text-[#38453E85] text-base font-bold leading-[98%] tracking-[0.01rem] underline underline-offset-4 courierNew cursor-pointer">
                      Find your size
                    </div>
                  </Link>
                </div>
              </div>
              <div className="quantity">
                <h3 className="text-[#000000C2] font-bold leading-[107%] tracking-[0.010rem] uppercase courierNew text-base">
                  Quantity
                </h3>
                <div className="flex items-center justify-center h-[2.69rem] gap-[1.25rem] mt-[.44rem] py-4 px-[1.19] border-2 border-[#38453E40] text-[#38453EC9]">
                  <button
                    className="px-4 py-2 cursor-pointer"
                    onClick={decrementQuantity}
                  >
                    <FiMinus />
                  </button>
                  <div className="text-lg font-bold leading-[77.5%] tracking-[0.01rem] uppercase courierNew text-[#38453EC9]">
                    {quantity}
                  </div>
                  <button
                    className="px-4 py-2 cursor-pointer"
                    onClick={incrementQuantity}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-[0.63rem]">
                <button
                  onClick={handleAddToCart}
                  className="flex justify-center items-center w-[13rem] sm:w-[14.5rem] h-[3.69rem] p-[0.63rem] gap-[0.63rem] bg-[#38453E] text-white font-base font-bold leading-[77.5%] tracking-[0.01rem] uppercase courierNew cursor-pointer"
                >
                  Add To Cart
                </button>

                <button
                  onClick={() => addToWishlist(singleData)}
                  className="flex justify-center items-center w-[3.6875rem] h-[3.69rem]  p-[0.63rem] gap-[0.63rem] bg-[#CED4CD]"
                >
                  <AiOutlineHeart size={20} />
                </button>
              </div>
            </div>
            <div className="share-button  p-[1.38rem] gap-[1.94rem] ">
              <h3 className="text-[#000000C2] font-bold leading-[107%] tracking-[0.010rem] uppercase courierNew text-base">
                Share
              </h3>
              <ul className="mt-[.44rem]">
                <div className="flex items-center gap-[0.63rem]">
                  <div
                    className="flex items-center justify-center w-[3.06rem] h-[3.06rem] gap-[0.63rem] bg-[#0000001A]"
                    onClick={copyLinkToClipboard}
                  >
                    <FaLink size={20} />
                  </div>
                  <div
                    className="flex items-center justify-center w-[3.06rem] h-[3.06rem] gap-[0.63rem] bg-[#0000001A]"
                    onClick={shareOnFacebook}
                  >
                    <FaFacebook size={20} />
                  </div>
                  <div
                    className="flex items-center justify-center w-[3.06rem] h-[3.06rem] gap-[0.63rem] bg-[#0000001A]"
                    onClick={shareOnInstagram}
                  >
                    <FaInstagram size={20} />
                  </div>
                  <button
                    className="flex items-center justify-center cursor-pointer w-[3.06rem] h-[3.06rem] gap-[0.63rem] bg-[#0000001A]"
                    onClick={() => shareOnTikTok(singleData.productName)}
                  >
                    <FaTiktok size={20} />
                  </button>
                  <div
                    className="flex items-center justify-center w-[3.06rem] h-[3.06rem] gap-[0.63rem] bg-[#0000001A]"
                    onClick={shareViaEmail}
                  >
                    <FaEnvelope size={20} />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full min-h-fit md:px-6">
          <h2 className="text-[#2c332e] my-12  font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide xl:text-xl">
            You may also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-[12px] md:gap-[20px]">
            {relatedProducts?.slice(0, 10).map((curElem) => {
              return <RelatedProductCard key={curElem.id} {...curElem} />;
            })}
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Product Size Guide
                  </Dialog.Title>
                  <div className="mt-2">
                    <img
                      src={SizeGuideImg}
                      className="w-full"
                      alt=""
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#CED4CD] px-4 py-2 text-sm font-medium text-[#38453E]  focus:outline-none focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <SidebarCart
        cartItems={cartItems}
        refetch={refetch}
        isLoading={isLoading}
        isCartBarOpen={isCartBarOpen}
        closeCartBar={closeCartBar}
        setIsCartBarOpen={setIsCartBarOpen}
      />
    </section>
  );
};

export default SingleProduct;
