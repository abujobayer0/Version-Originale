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

const SSHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartBarOpen, setIsCartBarOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const { selectedCurrency } = useCurrency();

  const { user } = useContext(AuthContext);
  const { data: userType, isLoding: loading } = useGetData(
    `/user?email=${user?.email}`
  );
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [total, setTotalPrice] = useState(1);
  const { data: cartItems, refetch } = useGetData(
    `/cart/item?email=${user?.email}`
  );

  const { isLoding, products } = useProductContext();
  if (isLoding || loading) {
    return (
      <div className="loader-container">
        <div className="loader">....Loading</div>
      </div>
    );
  }

  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentProducts = products.filter((product) => {
    const productDate = new Date(product.date);
    return productDate >= thirtyDaysAgo && productDate <= currentDate;
  });

  const latestProducts = recentProducts.slice(-3);

  const productsToShow =
    latestProducts.length > 0
      ? latestProducts
      : products.sort(() => Math.random() - 0.5).slice(0, 3);

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
    navigate(`/search/${searchTerm}`);
    setIsSearchBarOpen(false);
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
      .then((data) => {
        refetch();
      });
  };
  const cartIncrementCount = (e) => {
    const uri = `https://test-originale.onrender.com/cart/increase/${e}`;
    fetch(uri, { method: "PUT" })
      .then((res) => res.json())
      .then((data) => refetch());
  };

  const cartDecrementCount = (e) => {
    const uri = `https://test-originale.onrender.com/cart/decrease/${e}`;
    fetch(uri, { method: "PUT" })
      .then((res) => res.json())
      .then((data) => refetch());
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

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <header className="relative">
      <div className="top-bar">
        <div className="container">
          <p className="helveticaNowDisplay text-[1.062rem] font-medium leading-[100%] tracking-[0.01rem]">
            20% Refer a friend Discount{" "}
            <span className="refer-modal" onClick={openModal}>
              Details
            </span>
          </p>
        </div>
      </div>
      <div className="hidden lg:block main-header -z-10">
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
            </div>
          </div>
        </div>
        <div className="devider"></div>
        <div className="container px-0 ">
          <div className="wrapper">
            <div className="bottom-nav pt-[1.2rem]">
              <ul className="flex items-center justify-center gap-[2.62rem] courierNew">
                <li>
                  <Link to={`/${countryRoute}/ss23/artistic`}> Artistic</Link>
                </li>
                <li>
                  <Link to={`/${countryRoute}/ss23/cartoonish`}>
                    {" "}
                    Cartoonish
                  </Link>
                </li>
                <li>
                  <Link to={`/${countryRoute}/ss23/anime`}> Anime</Link>
                </li>
                <li>
                  <Link to={`/${countryRoute}/ss23/retro`}>Retro</Link>
                </li>
              </ul>
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
                  <img src={logo} alt="logo" loading="lazy" className="w-20" />
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
                          to={`/${countryRoute}/ss23/artistic`}
                          className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                          onClick={closeMobileMenu}
                        >
                          Artistic
                          <IoIosArrowForward size={25} />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/${countryRoute}/ss23/cartoonish`}
                          className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                          onClick={closeMobileMenu}
                        >
                          Cartoonish
                          <IoIosArrowForward size={25} />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/${countryRoute}/ss23/anime`}
                          className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                          onClick={closeMobileMenu}
                        >
                          Anime
                          <IoIosArrowForward size={25} />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/${countryRoute}/ss23/retro`}
                          className="flex items-center justify-between text-[#38453ec2] text-base font-bold leading-[107%] tracking-[0.01rem] uppercase courierNew"
                          onClick={closeMobileMenu}
                        >
                          {" "}
                          Retro
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
                      <li></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mobile-iconset flex items-center justify-end gap-[1.2rem] text-white">
                <div className="search cursor-pointer" onClick={openSearchBar}>
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
                        ${
                          isCartBarOpen ? "translate-x-0" : "translate-x-full "
                        }`}
        >
          <div className="flex items-center justify-between px-[2.06rem] pt-[1.33rem] pb-[1.32rem] border-b-2 border-[#0000003d] h-[10%]">
            <h2 className="text-[#191E1B] courierNew text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase">
              Shopping Cart
            </h2>
            <div
              className="bg-[--primary-color] p-1 rounded-full cursor-pointer"
              onClick={closeCartBar}
            >
              <BiX size={25} />
            </div>
          </div>
          <div className="h-[55%] pt-[1.06rem] pl-[2.06rem] pr-[2.13rem]">
            {cartItems?.slice(0, 2).map((product, index) => (
              <div
                className="product w-full border-[1.26px] border-[#dcdcdc] h-[9.6rem] p-2 flex justify-start items-start gap-[1.06rem]"
                key={index}
              >
                <div className="product-img">
                  <img
                    src={product?.img}
                    alt=""
                    className="h-[8.4rem] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="product-details w-[9rem] flex flex-col gap-[0.56rem]">
                  <Link to={`/${countryRoute}/product/${product._id}`}>
                    <h2 className="text-[#747474] euroWide text-[.78rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                      {product?.item.productName}
                    </h2>
                  </Link>
                  <p className="text-[#32493D] euroWide text-[.78rem] font-bold leading-[122.5%] tracking-[0.0089rem]">
                    {selectedCurrency === "BDT" ? (
                      <p> BDT {product.price}</p>
                    ) : (
                      <p> AED {product.price}</p>
                    )}
                  </p>
                  <div className="flex items-center gap-[0.56rem]">
                    <div className="flex items-center justify-between gap-[1.63rem] border-2 border-[#191E1B] h-[2.25rem] py-[1.06rem] px-[1.19rem]">
                      <button onClick={() => cartDecrementCount(product._id)}>
                        <BiMinus size={20} />
                      </button>
                      <span>{product.quantity}</span>
                      <button onClick={() => cartIncrementCount(product._id)}>
                        <BiPlus size={20} />
                      </button>
                    </div>
                    <div className="remove-item">
                      <button onClick={() => removeItem(product._id)}>
                        <MdDeleteOutline size={25} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[35%] border-t-2 border-[#0000003d] pt-[1.5rem] pb-[3.06rem] pl-[2.06rem] pr-[2.13rem]">
            <div className="flex items-center justify-between">
              <h2 className="text-[#191E1B] text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase courierNew">
                Sub Total
              </h2>
              <h2 className="text-[#191E1B] text-[1.06rem] font-bold leading-[77.5%] tracking-[0.012rem] uppercase courierNew ml-[1.5rem]">
                <span className="currency">
                  {selectedCurrency === "BDT" ? "BDT" : "AED"}
                </span>{" "}
                <span className="amount">{total.toFixed(2)}</span>
              </h2>
            </div>
            <div className="flex items-center py-[1.44rem] term-checkout">
              <input
                id="default-checkbox"
                type="checkbox"
                className="w-[1.25rem] h-[1.25rem] outline-none border-2 border-[#191e1b80]"
              />
              <label
                htmlFor="default-checkbox"
                className="ml-2  text-[#191e1b80] font-bold text-[.9rem] leading-[122.5%] tracking-[0.01rem] courierNew"
              >
                I agree with terms and condition
              </label>
            </div>
            <Link
              to={`/${countryRoute}/cart`}
              className="view-cart border-2 border-black w-full h-[3rem] flex justify-center items-center mb-[0.62rem] text-[1.0625rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
              onClick={closeCartBar}
            >
              View Cart
            </Link>
            <Link
              to={`/${countryRoute}/checkout`}
              className="checkout border-2 bg-black text-white w-full h-[3rem] flex justify-center items-center text-[1.0625rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
              onClick={closeCartBar}
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <div
        className={`fixed bg-[#1c1e22]/50 inset-0 transition-all transform ease-in-out delay-400 duration-500 h-screen
        ${isSearchBarOpen ? "translate-y-0 z-[999]" : "-translate-y-[100%]"}`}
      >
        <div
          className={`w-screen top-0 absolute bg-white h-[35rem] shadow-xl delay-400 duration-500 ease-in-out transition-all transform
            ${isSearchBarOpen ? "translate-y-0" : "-translate-y-[35rem]"}`}
        >
          <div className="flex flex-col justify-center items-center pt-[3.69rem]">
            <div className="px-2 relative text-gray-600" id="search-btn">
              <input
                className="border-none outline-none bg-[#ECECEC] w-[18rem] xl:w-[35rem] h-12 px-4 text-[1.062rem] text-[#00000075] courierNew"
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
            <div className="latest-drop mt-[2.31rem] xl:mt-[3.31rem] hidden lg:block">
              <h2 className="text-[#191E1B] font-bold leading-[77.5%] tracing-[0.02rem] euroWide text-center text-[1.3rem] xl:text-[2.44rem]">
                Check out the latest drops!
              </h2>
              <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1.06rem] px-[14.61rem] mt-[2.31rem]">
                  {productsToShow.map((product, index) => (
                    <Link
                      to={`/${countryRoute}/product/${product._id}`}
                      className={`w-full border-[1.76px] border-[#B7B8B5] py-[0.69rem] px-[0.63rem] sm:px-[1.1rem] sm:py-[0.99rem] flex flex-col items-start gap-[1.06rem]`}
                      key={index}
                      onClick={closeSearchBar}
                    >
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-full h-[12rem] object-cover"
                        loading="lazy"
                      />
                      <div className="details">
                        <h3 className="text-[#494747] text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide">
                          {product.productName}
                        </h3>
                        <p className="text-[#4E8142] text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide mt-[0.56rem]">
                          {selectedCurrency === "BDT" ? (
                            <p> BDT {product.bdPrice}</p>
                          ) : (
                            <p> AED {product.dubaiPrice}</p>
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
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
                Free Ground Shipping on orders of $75+. Not valid on gift cards
                or previous purchases.
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
  );
};

export default SSHeader;
