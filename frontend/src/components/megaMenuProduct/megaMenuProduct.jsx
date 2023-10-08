import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";
import { TrackGoogleAnalyticsEvent } from "../../analytics/googleAnalytics/googleAnalytics";

const MegaMenuProduct = (curElem) => {
  const { selectedCurrency } = useCurrency();
  const {
    _id,
    productName,
    bdPrice,
    dubaiPrice,
    resizedImages,
    stock,
    category,
    bdPriceSale,
    dubaiPriceSale,
  } = curElem;

  const sampleAction = "Button_Clicked";

  const handleSelect = (value) => {
    TrackGoogleAnalyticsEvent(category, sampleAction);
  };
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  return (
    <Link to={`/${countryRoute}/product/${_id}`} className="w-full h-full">
      <div className="group border-[1.76px]  border-[#fff]/20 my-10  flex w-full  flex-col overflow-hidden  shadow-md">
        <a
          className="relative mx-3 mt-3 flex h-52 lg:h-72 overflow-hidden "
          href="#"
        >
          <img
            className="peer absolute aspect-square top-0 right-0 h-full w-full object-top object-cover"
            src={resizedImages[0]}
            alt="product image"
            loading="lazy"
          />
          <img
            className="peer absolute aspect-square top-0 -right-96 h-full w-full object-top object-cover transition-all delay-100 duration-1000 hover:right-0 peer-hover:right-0"
            src={resizedImages[1]}
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
          {stock === "unavailable" && (
            <div className="bg-red-500 text-white font-bold py-1 px-2  absolute top-2 right-2">
              Stock Out
            </div>
          )}
        </a>
        <div className="mt-4  px-5 pb-0">
          <a href="#">
            <h3 className="text-[#fff] text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] line-clamp-1 tracking-[0.009rem] euroWide">
              {productName}{" "}
            </h3>
          </a>
          <div className="mb-5 flex relative items-center justify-between">
            <p className="flex items-center gap-2 text-[#fff] text-opacity-70  text-[.75rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ">
              {bdPriceSale !== 0 && dubaiPrice !== 0 && (
                <p className="text-[#fff] text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide ">
                  {selectedCurrency === "BDT" ? (
                    <p className="text-[#fff] text-opacity-70  whitespace-nowrap text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide ">
                      BDT {bdPriceSale}
                    </p>
                  ) : (
                    <p className="text-[#fff] text-opacity-70  text-[.65rem] whitespace-nowrap sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ">
                      AED {dubaiPriceSale}
                    </p>
                  )}
                </p>
              )}{" "}
              <p
                className={`text-[#fff] text-opacity-70  text-[.65rem] sm:text-[.70rem] font-bold leading-[122.5%] tracking-[0.009rem] euroWide  ${
                  bdPriceSale && dubaiPriceSale
                    ? "line-through sm:text-[.60rem] absolute -bottom-3 sm:relative sm:bottom-0 "
                    : ""
                }`}
              >
                {selectedCurrency === "BDT" ? (
                  <p className="whitespace-nowrap">BDT {bdPrice}</p>
                ) : (
                  <p className="whitespace-nowrap">AED {dubaiPrice}</p>
                )}
              </p>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MegaMenuProduct;
