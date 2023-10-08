import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.webp";
import {
  BiSearch,
  BiHeart,
  BiUserCircle,
  BiShoppingBag,
  BiX,
  BiMinus,
  BiPlus,
} from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import { useProductContext } from "../context/productContext";
import { AuthContext } from "../context/contextAPI";
import { useGetData } from "../customHooks/useGetData/useGetData";
import { useCurrency } from "../context/CurrencyContext";
import Product from "../components/product/product";
import ReactTextTransition, { presets } from "react-text-transition";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import { Collapse } from "react-collapse";
import MegaMenuProduct from "../components/megaMenuProduct/megaMenuProduct";

// import required modules
const TEXTS = [
  "20% Refer a friend Discount",
  "Special Offer Today!",
  "Limited Time Discount",
];
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartBarOpen, setIsCartBarOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const { selectedCurrency, locationLoading, isValid } = useCurrency();
  const [containerHover, setContainerHover] = useState(false);
  const [collectionHover, setCollectionHover] = useState(false);
  const [containerHoverSticky, setContainerHoverSticky] = useState(false);
  const [collectionHoverSticky, setCollectionHoverSticky] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const { data: categories, isLoading } = useGetData("/categories");
  const [sticky, setSticky] = useState(false);
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 53) {
      setIsHeaderFixed(true);
    } else {
      setIsHeaderFixed(false);
    }
  };
  const { user } = useContext(AuthContext);
  const { data: userType, isLoding: loading } = useGetData(
    `/user?email=${user?.email}`
  );
  const [searchTerm, setSearchTerm] = useState("");
  const toggleCollection = () => {
    setIsCollectionOpen(!isCollectionOpen);
  };
  const navigate = useNavigate();
  const [total, setTotalPrice] = useState(1);
  const { data: cartItems, refetch } = useGetData(
    `/cart/item?email=${user?.email}`
  );
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  const { isLoding, products } = useProductContext();

  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentProducts = products.filter((product) => {
    const productDate = new Date(product.date);
    return productDate >= thirtyDaysAgo && productDate <= currentDate;
  });

  const latestProducts = recentProducts.slice(-4);

  const productsToShow =
    latestProducts.length > 0
      ? latestProducts
      : products.sort(() => Math.random() - 0.5).slice(0, 4);
  // Mobile Menu
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  //offer modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  // Cart Bar
  const openCartBar = () => {
    setIsCartBarOpen(true);
  };

  const closeCartBar = () => {
    setIsCartBarOpen(false);
  };

  // Serach Bar
  const openSearchBar = () => {
    setIsSearchBarOpen(true);
  };

  const closeSearchBar = () => {
    setIsSearchBarOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/${countryRoute}/search/${searchTerm}`);
      setIsSearchBarOpen(false);
    } else {
      navigate(`/${countryRoute}/search/a`);
      setIsSearchBarOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setIsSearchBarOpen(false);
    }
  };
  const removeItem = (e) => {
    const uri = `https://test-originale.onrender.com/cart/delete/${e}`;
    fetch(uri, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        refetch();
      });
  };
  const cartIncrementCount = (e) => {
    const uri = `https://test-originale.onrender.com/cart/increase/${e}`;
    fetch(uri, { method: "PUT" })
      .then((res) => res.json())
      .then(() => refetch());
  };

  const cartDecrementCount = (e) => {
    const uri = `https://test-originale.onrender.com/cart/decrease/${e}`;
    fetch(uri, { method: "PUT" })
      .then((res) => res.json())
      .then(() => refetch());
  };
  const calculateTotalPrice = () => {
    let total = 0;

    if (cartItems && Array.isArray(cartItems)) {
      total = cartItems.reduce((accumulator, item) => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);

        if (!isNaN(price) && !isNaN(quantity)) {
          const subtotal = price * quantity;
          return accumulator + subtotal;
        }

        return accumulator;
      }, 0);
    }

    setTotalPrice(total);
  };
  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState(TEXTS[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * TEXTS.length);
      setDisplayText(TEXTS[randomIndex]);
    }, 4000);
    return () => clearTimeout(timer);
  }, [displayText]);
  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 7000);
    return () => clearInterval(intervalId);
  }, []);

  const plainTeesSub =
    !isLoading && categories?.find((i) => i.category === "Plain Tees");
  const cargoPantsSub =
    !isLoading && categories?.filter((i) => i.category === "Cargo Pants");
  const lininTrouserSub =
    !isLoading && categories?.filter((i) => i.category === "Linin Trousers");
  const shirtSub =
    !isLoading && categories?.filter((i) => i.category === "Shirt");
  const dropShoulderSub =
    !isLoading && categories?.filter((i) => i.category === "Drop Shoulder");

  return (
    <>
      {!isValid && !locationLoading && (
        <div className="min-w-full py-2 px-5 bg-yellow-200">
          This website is currently not available on your country!
        </div>
      )}
      <header className="relative">
        <div
          className={` hidden top-bar transition-all ease-in-out duration-300`}
        >
          <div className="container">
            <p className="helveticaNowDisplay text-[1.062rem] font-medium leading-[100%] tracking-[0.01rem] flex items-center justify-center">
              {displayText}
              <span className="refer-modal ml-1" onClick={openModal}>
                Details
              </span>
            </p>
          </div>
        </div>
        <div
          className={`main-header hidden lg:block ${
            isHeaderFixed ? "" : "  -z-10"
          } transition-all ease-in-out duration-300`}
        >
          <div className="container px-[3.88rem]">
            <div className="wrapper">
              <div className="mid-nav">
                <div className="flex items-center gap-[2.12rem]">
                  <Link to={`/${countryRoute}/about`}>About</Link>
                  <Link to={`/${countryRoute}/contact`}>Contact</Link>
                </div>
                <Link to={`/${countryRoute}/`} className="logo mr-[90px]">
                  <img src={logo} alt="logo" loading="lazy" />
                </Link>
                <div className="midNav-iconset">
                  <div
                    className="search cursor-pointer"
                    onClick={openSearchBar}
                  >
                    <BiSearch size={25} />
                  </div>
                  <Link
                    to={`/${countryRoute}/wishlist`}
                    className="wishlist cursor-pointer"
                  >
                    <BiHeart size={25} />
                  </Link>
                  <div className="relative logout-container">
                    {userType?.role === "admin" ? (
                      <Link to={`/admin`} className="account cursor-pointer">
                        <BiUserCircle size={25} />
                      </Link>
                    ) : (
                      <Link
                        to={`/user/panel`}
                        className="account cursor-pointer"
                      >
                        <BiUserCircle size={25} />
                      </Link>
                    )}
                  </div>

                  <div className="cart cursor-pointer" onClick={openCartBar}>
                    <BiShoppingBag size={25} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="devider"></div>
          <div
            // onMouseEnter={() => setContainerHover(true)}
            // onMouseLeave={() => setContainerHover(false)}
            className=" px-0 mega-menu-group relative "
          >
            <div className="wrapper">
              <div className="bottom-nav pt-[1.2rem]">
                <ul className="flex items-center justify-center gap-[2.62rem] courierNew">
                  <li onMouseEnter={() => setContainerHover(false)}>
                    <Link to={`/${countryRoute}/new-drop`}>New Drop</Link>
                  </li>
                  <li onMouseEnter={() => setContainerHover(false)}>
                    <Link to={`/${countryRoute}/best-selling`}>
                      Best selling
                    </Link>
                  </li>
                  <li onMouseEnter={() => setContainerHover(false)}>
                    <Link to={`/${countryRoute}/ss23`}>SS 23</Link>
                  </li>
                  <li
                    onMouseEnter={() => {
                      setContainerHover(true);
                      setCollectionHover(true);
                    }}
                  >
                    <Link
                      to={`/${countryRoute}/collections`}
                      className="group-hover:text-gray-100"
                    >
                      Collection
                    </Link>
                  </li>
                  <li onMouseEnter={() => setContainerHover(false)}>
                    <Link to={`/${countryRoute}/panjabi`}>Panjabi</Link>
                  </li>
                  <li onMouseEnter={() => setContainerHover(false)}>
                    <Link to={`/${countryRoute}/jersey`}>Jersey</Link>
                  </li>
                  <li onMouseEnter={() => setContainerHover(false)}>
                    <Link to={`/${countryRoute}/story`}>Stories</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              onMouseEnter={() => {
                setContainerHover(true);
                setCollectionHover(true);
              }}
              onMouseLeave={() => {
                setContainerHover(false);
                setCollectionHover(false);
              }}
              className={`mega-menu-content  absolute left-0 mt-2 mx-auto bg-[#38453e] border right-0 w-full  border-gray-300 shadow-lg  px-[4rem] py-[4rem] space-y-4 ${
                containerHover && collectionHover
                  ? "block slide-down-mega-menu "
                  : "hidden transition-all duration-300 ease-in-out"
              }`}
              style={{ background: "#38453e" }}
            >
              <div className="gap-4 flex flex-wrap 2xl:flex-nowrap w-full">
                <div className="w-[60%] flex gap-24">
                  <div className="">
                    <h3 className="text-lg text-white font-semibold whitespace-nowrap">
                      Plain Tees
                    </h3>
                    <ul className="mt-2 text-white space-y-2">
                      {plainTeesSub?.subCategory?.map((subcategory, n) => (
                        <li key={n}>
                          <a href="#">{subcategory}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="">
                    <h3 className="text-lg text-white whitespace-nowrap font-semibold">
                      Drop Shoulder
                    </h3>
                    <ul className="mt-2 text-white space-y-2">
                      {dropShoulderSub?.subCategory?.map((subcategory, x) => (
                        <li key={x}>
                          <a href="#">{subcategory}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="">
                    <h3 className="text-lg text-white whitespace-nowrap font-semibold">
                      Shirt
                    </h3>
                    <ul className="mt-2 text-white space-y-2">
                      {shirtSub?.subCategory?.map((subcategory, x) => (
                        <li key={x}>
                          <a href="#">{subcategory}</a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="">
                    <h3 className="text-lg text-white whitespace-nowrap font-semibold">
                      Linen Trousers{" "}
                    </h3>
                    <ul className="mt-2 text-white space-y-2">
                      {lininTrouserSub?.subCategory?.map((subcategory, x) => (
                        <li key={x}>
                          <a href="#">{subcategory}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="">
                    <h3 className="text-lg text-white font-semibold whitespace-nowrap">
                      Cargo Pants
                    </h3>
                    <ul className="mt-2 text-white space-y-2">
                      {cargoPantsSub?.subCategory?.map((subcategory, x) => (
                        <li key={x}>
                          <a href="#">{subcategory}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="w-[40%]">
                  <div className=" grid gap-12 grid-cols-2">
                    {productsToShow?.slice(1, 3).map((curElem) => {
                      return <MegaMenuProduct key={curElem._id} {...curElem} />;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* sticky navbar desktop */}
        <div
          className={`
            ${
              isHeaderFixed
                ? "top-0  z-[9999] sticky-nav items-center hidden lg:flex justify-between w-full slide-down px-10 py-12"
                : "hidden  transition-all duration-500 ease-in-out"
            }
        `}
        >
          <Link to={`/${countryRoute}/`} className="logo">
            <img src={logo} alt="logo" loading="lazy" />
          </Link>
          <div className="sticky-menu_link">
            <ul className="flex items-center justify-center gap-[2.62rem] courierNew">
              <li>
                <Link
                  to={`/${countryRoute}/new-drop`}
                  onMouseEnter={() => setContainerHoverSticky(false)}
                >
                  New Drop
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/best-selling`}
                  onMouseEnter={() => setContainerHoverSticky(false)}
                >
                  Best selling
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/ss23`}
                  onMouseEnter={() => setContainerHoverSticky(false)}
                >
                  SS 23
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/collections`}
                  onMouseEnter={() => {
                    setContainerHoverSticky(true);
                    setCollectionHoverSticky(true);
                    setSticky(true);
                  }}
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/panjabi`}
                  onMouseEnter={() => setContainerHoverSticky(false)}
                >
                  Panjabi
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/jersey`}
                  onMouseEnter={() => setContainerHoverSticky(false)}
                >
                  Jersey
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/story`}
                  onMouseEnter={() => setContainerHoverSticky(false)}
                >
                  Stories
                </Link>
              </li>
            </ul>
          </div>
          <div className="sticky-iconset flex items-center gap-4">
            <div className="search cursor-pointer" onClick={openSearchBar}>
              <BiSearch size={25} />
            </div>
            <Link
              to={`/${countryRoute}/wishlist`}
              className="wishlist cursor-pointer"
            >
              <BiHeart size={25} />
            </Link>
            <div className="relative logout-container">
              {userType?.role === "admin" ? (
                <Link to={`/admin`} className="account cursor-pointer">
                  <BiUserCircle size={25} />
                </Link>
              ) : (
                <Link to={`/user/panel`} className="account cursor-pointer">
                  <BiUserCircle size={25} />
                </Link>
              )}
            </div>

            <div className="cart cursor-pointer" onClick={openCartBar}>
              <BiShoppingBag size={25} />
            </div>
          </div>
          <div
            onMouseEnter={() => {
              setContainerHoverSticky(true);
              setCollectionHoverSticky(true);
            }}
            onMouseLeave={() => {
              setContainerHoverSticky(false);
              setCollectionHoverSticky(false);
            }}
            className={`mega-menu-content  absolute left-0 mx-auto bg-[#38453e] border right-0 w-full px-[4rem] border-gray-300 shadow-lg   py-[4rem]  ${
              containerHoverSticky && collectionHoverSticky
                ? "block slide-down-mega-menu-sticky "
                : "hidden transition-all duration-300 ease-in-out"
            }`}
            style={{ background: "#38453e" }}
          >
            <div className="gap-4 flex flex-wrap 2xl:flex-nowrap w-full">
              <div className="w-[60%] flex gap-24">
                <div className="">
                  <h3 className="text-lg text-white font-semibold whitespace-nowrap">
                    Plain Tees
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {plainTeesSub?.subCategory?.map((subcategory, n) => (
                      <li key={n}>
                        <a href="#" className="text-sm">
                          {subcategory}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="">
                  <h3 className="text-lg text-white whitespace-nowrap font-semibold">
                    Drop Shoulder
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {dropShoulderSub?.subCategory?.map((subcategory, x) => (
                      <li key={x}>
                        <a href="#">{subcategory}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="">
                  <h3 className="text-lg text-white whitespace-nowrap font-semibold">
                    Shirt
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {shirtSub?.subCategory?.map((subcategory, x) => (
                      <li key={x}>
                        <a href="#">{subcategory}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="">
                  <h3 className="text-lg text-white whitespace-nowrap font-semibold">
                    Linen Trousers{" "}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {lininTrouserSub?.subCategory?.map((subcategory, x) => (
                      <li key={x}>
                        <a href="#">{subcategory}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="">
                  <h3 className="text-lg text-white font-semibold">
                    Cargo Pants
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {cargoPantsSub?.subCategory?.map((subcategory, x) => (
                      <li key={x}>
                        <a href="#">{subcategory}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-[40%]">
                <div className=" grid gap-12 grid-cols-2">
                  {productsToShow?.slice(1, 3).map((curElem) => {
                    return <MegaMenuProduct key={curElem._id} {...curElem} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile-header flex lg:hidden">
          <div className="container px-6">
            <div className="wrapper">
              <div className="flex items-center justify-between">
                <div
                  className="toggle-icon cursor-pointer text-white"
                  onClick={openMobileMenu}
                >
                  <div>
                    <HiOutlineMenuAlt4 size={25} />
                  </div>
                </div>
                <div className="logo ml-[60px] sm:ml-[130px]">
                  <Link to={`/${countryRoute}/`}>
                    <img
                      src={logo}
                      alt="logo"
                      loading="lazy"
                      className="w-20"
                    />
                  </Link>
                </div>
                <div>
                  <div
                    className={`mobileMenu absolute top-0 left-0 bg-white h-screen w-full transform transition-transform duration-500 ease-in-out z-[999] p-0 flex flex-col ${
                      isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pt-[1.14rem] pb-[1.24rem] px-[1.25rem]">
                        <div
                          className="close cursor-pointer"
                          onClick={closeMobileMenu}
                        >
                          <BiX size={30} />
                        </div>
                        <div className="flex items-center justify-end gap-[1.2rem] text-black">
                          <div
                            className="search cursor-pointer"
                            onClick={openSearchBar}
                          >
                            <BiSearch size={25} />
                          </div>
                          {userType?.role === "admin" ? (
                            <Link
                              to={`/admin`}
                              className="account cursor-pointer"
                            >
                              <BiUserCircle size={25} />
                            </Link>
                          ) : (
                            <Link
                              to={`/user/panel`}
                              className="account cursor-pointer"
                            >
                              <BiUserCircle size={25} />
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-[0.69rem] justify-center pb-[1.24rem]">
                        <Link
                          to={`/${countryRoute}/cart`}
                          onClick={closeMobileMenu}
                        >
                          <div className="cart cursor-pointer inline-flex items-center gap-[0.94rem] w-full h-[3.24rem] pl-[1.31rem] pr-[1.25rem] border-2 bborder-[#38453e] text-[#38453E] text-[1rem] font-bold leading-[122.5%] tracking-[0.01rem] uppercase courierNew">
                            <BiShoppingBag size={20} />
                            My Cart
                          </div>
                        </Link>
                        <Link
                          to={`/${countryRoute}/wishlist`}
                          onClick={closeMobileMenu}
                        >
                          <div className="cart cursor-pointer inline-flex items-center gap-[0.94rem] w-full h-[3.24rem] pl-[1.31rem] pr-[1.25rem] border-2 bborder-[#38453e] text-[#38453E] text-[1rem] font-bold leading-[122.5%] tracking-[0.01rem] uppercase courierNew">
                            <BiHeart size={20} />
                            Wishlist
                          </div>
                        </Link>
                      </div>
                      <hr className="h-[0.12rem] border-t-0 bg-black opacity-[0.21]" />
                      <ul className="px-[1.25rem] py-[1.24rem] flex flex-col gap-[1.36rem]">
                        <li>
                          <Link
                            to={`/${countryRoute}/new-drop`}
                            className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                            onClick={closeMobileMenu}
                          >
                            New Drop
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/${countryRoute}/best-selling`}
                            className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                            onClick={closeMobileMenu}
                          >
                            Best Selling
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/${countryRoute}/ss23`}
                            className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                            onClick={closeMobileMenu}
                          >
                            SS 23
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/${countryRoute}/collections`}
                            className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                            onClick={toggleCollection}
                          >
                            Collections
                            <button
                              className={`${
                                isCollectionOpen ? "rotate-90" : "rotate-0"
                              }`}
                            >
                              <IoIosArrowForward size={25} />
                            </button>
                          </Link>
                          <Collapse
                            isOpened={isCollectionOpen}
                            className={`collapsible-content ${
                              isCollectionOpen ? "opened" : ""
                            }`}
                          >
                            <div className="flex-col bg-gray-50 p-2 flex w-full">
                              <div className="w-full flex-col items-start justify-start flex gap-2">
                                <div className="mt-4">
                                  <h3 className="whitespace-nowrap opacity-60 text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew">
                                    Plain Tees
                                  </h3>
                                  <ul className="mt-4 space-y-2">
                                    {plainTeesSub?.subCategory?.map(
                                      (subcategory, n) => (
                                        <li
                                          className="text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                                          key={n}
                                        >
                                          <a href="#">{subcategory}</a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                                <div className="mt-4">
                                  <h3 className="whitespace-nowrap opacity-60 text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew">
                                    Drop Shoulder
                                  </h3>
                                  <ul className="mt-4 space-y-2">
                                    {dropShoulderSub?.subCategory?.map(
                                      (subcategory, x) => (
                                        <li key={x}>
                                          <a href="#">{subcategory}</a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                                <div className="mt-4">
                                  <h3 className="whitespace-nowrap opacity-60 text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew">
                                    Shirt
                                  </h3>
                                  <ul className="mt-4 space-y-2">
                                    {shirtSub?.subCategory?.map(
                                      (subcategory, x) => (
                                        <li key={x}>
                                          <a href="#">{subcategory}</a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>

                                <div className="mt-4">
                                  <h3 className="whitespace-nowrap opacity-60 text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew">
                                    Linen Trousers{" "}
                                  </h3>
                                  <ul className="mt-4 space-y-2">
                                    {lininTrouserSub?.subCategory?.map(
                                      (subcategory, x) => (
                                        <li key={x}>
                                          <a href="#">{subcategory}</a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                                <div className="mt-4">
                                  <h3 className="whitespace-nowrap opacity-60 text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew">
                                    Cargo Pants
                                  </h3>
                                  <ul className="mt-4 space-y-2">
                                    {cargoPantsSub?.subCategory?.map(
                                      (subcategory, x) => (
                                        <li key={x}>
                                          <a href="#">{subcategory}</a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </Collapse>
                        </li>
                        <li>
                          <Link
                            to={`/${countryRoute}/panjabi`}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                          >
                            Panjabi
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/${countryRoute}/jersey`}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                          >
                            Jersey
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/${countryRoute}/story`}
                            className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                            onClick={closeMobileMenu}
                          >
                            Stories
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <Link
                            to={`/${countryRoute}/contact`}
                            className="flex items-center justify-between h-[3.56rem] px-[1.38rem]  bg-[#e8eae5] text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                            onClick={closeMobileMenu}
                          >
                            Contact Us
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={`/${countryRoute}/about`}
                            className="flex items-center justify-between h-[3.56rem] px-[1.38rem]  bg-[#e8eae5] text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                            onClick={closeMobileMenu}
                          >
                            about
                            <IoIosArrowForward size={25} />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mobile-iconset flex items-center justify-end gap-[1.2rem] text-white">
                  <div
                    className="search cursor-pointer"
                    onClick={openSearchBar}
                  >
                    <BiSearch size={25} />
                  </div>
                  {userType?.role === "admin" ? (
                    <Link to={`/admin`} className="account cursor-pointer">
                      <BiUserCircle size={25} />
                    </Link>
                  ) : (
                    <Link to={`/user/panel`} className="account cursor-pointer">
                      <BiUserCircle size={25} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* cart bar */}
        <div
          className={`fixed bg-[#1c1e22]/50 inset-0 transform ease-in-out
                ${
                  isCartBarOpen
                    ? "transition-opacity opacity-100 duration-500 translate-x-0 z-[999]"
                    : "transition-all delay-500 opacity-0 translate-x-full"
                }`}
        >
          <div
            className={`w-screen max-w-[420px] right-0 absolute bg-white h-screen shadow-xl delay-400 duration-500 ease-in-out transition-all transform
                    ${isCartBarOpen ? "translate-x-0" : "translate-x-full "}`}
          >
            <div class="pointer-events-auto w-screen max-w-md">
              <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div class="flex items-start justify-between border-b border-gray-200 pb-2">
                    <h2 className="text-[#191E1B] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase">
                      Shopping cart
                    </h2>
                    <div
                      className="bg-[--primary-color] p-1 rounded-full cursor-pointer ml-3 flex h-7 items-center"
                      onClick={closeCartBar}
                    >
                      <BiX size={25} />
                    </div>
                  </div>
                  <div class="mt-8">
                    <div class="flow-root">
                      <ul role="list" class="-my-6 divide-y divide-gray-200">
                        {cartItems?.map((product, index) => (
                          <li
                            class="py-4 flex border-[1.26px] border-[#dcdcdc]"
                            key={index}
                          >
                            <div class="h-28 w-24 flex-shrink-0 overflow-hidden">
                              <img
                                src={product?.img}
                                alt={product?.item.productName}
                                class="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div class="ml-6 flex flex-1 flex-col">
                              <div>
                                <div class="flex flex-col gap-[0.56rem] items-start">
                                  <Link
                                    to={`/${countryRoute}/product/${product?._id}`}
                                  >
                                    <h3 className="text-[#747474] euroWide text-[.78rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                                      {product?.item.productName}
                                    </h3>
                                  </Link>
                                  <p class="text-[#32493D] euroWide text-[.78rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                                    {selectedCurrency === "BDT" ? (
                                      <p> BDT {product?.price}</p>
                                    ) : (
                                      <p> AED {product?.price}</p>
                                    )}
                                  </p>
                                </div>
                                <div className="flex items-center gap-[0.56rem] mt-2">
                                  <div className="flex items-center justify-between gap-[1.63rem] border-2 border-[#191E1B] h-[2.25rem] py-[1.06rem] px-[1.19rem]">
                                    <button
                                      onClick={() =>
                                        cartDecrementCount(product?._id)
                                      }
                                    >
                                      <BiMinus size={20} />
                                    </button>
                                    <span>{product?.quantity}</span>
                                    <button
                                      onClick={() =>
                                        cartIncrementCount(product?._id)
                                      }
                                    >
                                      <BiPlus size={20} />
                                    </button>
                                  </div>
                                  <div className="remove-item">
                                    <button
                                      onClick={() => removeItem(product?._id)}
                                    >
                                      <MdDeleteOutline size={25} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <p className="text-[#191E1B] text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase courierNew">
                      Subtotal
                    </p>
                    <p className="text-[#191E1B] text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase courierNew ml-[1.5rem]">
                      <span className="currency">
                        {selectedCurrency === "BDT" ? "BDT" : "AED"}
                      </span>{" "}
                      <span className="amount">{total?.toFixed(2)}</span>
                    </p>
                  </div>
                  <div class="mt-6">
                    <Link
                      to={`/${countryRoute}/cart`}
                      class="view-cart border-2 border-black text-[1.0625rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew flex items-center justify-center bg-transparent px-6 py-3 text-black"
                    >
                      View Cart
                    </Link>
                  </div>
                  <div class="mt-6">
                    <Link
                      to={`/${countryRoute}/checkout`}
                      class="checkout border-2 bg-black text-white text-[1.0625rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew flex items-center justify-center px-6 py-3"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div
          className={`fixed bg-[#1c1e22]/50 inset-0 transition-all transform ease-in-out delay-400 duration-500 h-screen
    ${isSearchBarOpen ? "translate-y-0 z-[999]" : "-translate-y-[100%]"}`}
        >
          <div
            className={`w-screen top-0 absolute bg-white h-[40rem] shadow-xl delay-400 duration-500 ease-in-out transition-all transform
        ${isSearchBarOpen ? "translate-y-0" : "-translate-y-[35rem]"}`}
          >
            <div className="flex flex-col justify-center items-center pt-[3.69rem]">
              <div className="px-2 relative text-gray-600" id="search-btn">
                <input
                  className="border-none outline-none bg-[#ECECEC] w-[18rem] xl:w-[35rem] 2xl:w-[50rem] h-12 px-4 text-[1.062rem] text-[#00000075] courierNew"
                  type="search"
                  name="search"
                  placeholder="Search for anything..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>
                  <BiSearch
                    size={20}
                    className="absolute right-0 top-0 mt-4 mr-6"
                  />
                </button>
              </div>

              <div className="latest-drop mt-[2.31rem] xl:mt-[3.31rem] block ">
                <h2 className="text-[#191E1B] font-bold leading-[77.5%] tracing-[0.02rem] euroWide text-center text-[1.3rem] xl:text-[2.44rem]">
                  Check out the latest drops!
                </h2>
                <div className="container ">
                  <div className="">
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={10}
                      breakpoints={{
                        640: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 40,
                        },
                        1024: {
                          slidesPerView: 4,
                          spaceBetween: 50,
                        },
                        1400: {
                          slidesPerView: 4,
                          spaceBetween: 60,
                        },
                      }}
                      className="mySwiper h-[360px]  lg:h-fit w-[300px] md:w-full xl:max-w-[96%] "
                    >
                      {productsToShow?.map((product, index) => (
                        <SwiperSlide key={index}>
                          <Link
                            to={`/${countryRoute}/product/${product?._id}`}
                            className="w-full h-full"
                          >
                            <div className="group border-[1.76px]  border-[#000]/20 my-10  flex w-full  flex-col overflow-hidden  ">
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
                              </a>
                              <div className="mt-4  px-5 pb-0">
                                <a href="#">
                                  <h3 className="text-[#000] text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] line-clamp-1 tracking-[0.009rem] euroWide">
                                    {product?.productName}{" "}
                                  </h3>
                                </a>
                                <div className="mb-5 flex items-center justify-between">
                                  <p className="flex items-center gap-2 text-green-800 text-opacity-70  text-[.75rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ">
                                    {product?.bdPriceSale !== 0 &&
                                      product?.dubaiPrice !== 0 && (
                                        <p className="text-green-800 text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide ">
                                          {selectedCurrency === "BDT" ? (
                                            <p className="text-green-800 text-opacity-70  whitespace-nowrap text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide ">
                                              BDT {product?.bdPriceSale}
                                            </p>
                                          ) : (
                                            <p className="text-green-800 text-opacity-70  text-[.65rem] whitespace-nowrap sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ">
                                              AED {product?.dubaiPriceSale}
                                            </p>
                                          )}
                                        </p>
                                      )}{" "}
                                    <p
                                      className={`text-green-800 text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ${
                                        product?.bdPriceSale &&
                                        product?.dubaiPriceSale
                                          ? "line-through sm:text-[.60rem]"
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
                </div>
              </div>
            </div>
            <div
              className="absolute top-5 right-5 bg-[--primary-color] p-1 rounded-full cursor-pointer"
              onClick={closeSearchBar}
            >
              <BiX
                size={25}
                className="transition-transform duration-500 ease hover:rotate-180"
              />
            </div>
          </div>
          <div className="w-full h-full" onClick={closeSearchBar}></div>
        </div>
        {/* offer modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal relative">
              <div className="modal-header">
                <span className="modal-title text-[#2c332e] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide">
                  Promotion Details
                </span>
              </div>
              <div className="modal-content flex flex-col gap-[1.06rem]">
                <p className="text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew">
                  End of Season Sale: Up to 70% Off. Promotions ends 9.6.23 at
                  11:59 PM PT. Prices are as marked. Cannot be combined with any
                  other offer. Only valid at calvinklein.us. Not valid on gift
                  cards or previous purchases.
                </p>
                <p className="text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew">
                  Free Ground Shipping on orders of $75+. Not valid on gift
                  cards or previous purchases.
                </p>
              </div>
              <BiX
                size={25}
                className="modal-close absolute top-[10px] right-[10px]"
                onClick={closeModal}
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
