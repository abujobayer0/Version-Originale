import { useCallback, useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { BiX } from "react-icons/bi";
import { BiChevronDown } from "react-icons/bi";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";

const MobileFilter = ({ Page, handleMobileFilter, handleSizes }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { selectedCurrency } = useCurrency();

  const { data: categories, isLoading } = useGetData("/categories");
  const { data: colors, isLoading: loading } = useGetData("/colors");
  const { data: maxPrices, isLoading: lOding } = useGetData("/maxPrices");

  const openMobileFilter = () => {
    setIsMobileFilterOpen(true);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  const toggleSort = () => {
    setIsSortOpen(!isSortOpen);
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const togglePrice = () => {
    setIsPriceOpen(!isPriceOpen);
  };

  const toggleSize = () => {
    setIsSizeOpen(!isSizeOpen);
  };

  const toggleColor = () => {
    setIsColorOpen(!isColorOpen);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleCategorySelect = useCallback(
    (category) => {
      setSelectedCategories((prevSelectedCategories) => {
        if (prevSelectedCategories.includes(category)) {
          return prevSelectedCategories.filter((item) => item !== category);
        } else {
          return [...prevSelectedCategories, category];
        }
      });
    },
    [selectedCategories]
  );

  const handleColorSelect = useCallback(
    (color) => {
      setSelectedColors((prevSelectedColors) => {
        if (prevSelectedColors.includes(color)) {
          return prevSelectedColors.filter((item) => item !== color);
        } else {
          return [...prevSelectedColors, color];
        }
      });
    },
    [selectedColors]
  );

  const handleSizeSelect = useCallback(
    (size) => {
      setSelectedSizes((prevSelectedSizes) => {
        if (prevSelectedSizes.includes(size)) {
          return prevSelectedSizes.filter((item) => item !== size);
        } else {
          return [...prevSelectedSizes, size];
        }
      });
    },
    [selectedSizes]
  );

  const demoSize = ["S", "X", "L", "XL", "XXL"];
  const sortOptions = [
    { value: "best-selling", label: "Best Selling" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-low-to-high", label: "Price Low to High" },
    { value: "price-high-to-low", label: "Price High to Low" },
  ];

  const handleSortOptionSelect = (option) => {
    setSelectedSortOption(option);
  };
  const handleFilter = (e) => {
    e.preventDefault();
    const filterQuery = {
      minPrice,
      maxPrice,
      selectedCategories,
      selectedColors,
      selectedSizes,
      selectedCurrency: selectedCurrency,
      sort: selectedSortOption,
      page: Page,
    };
    handleSizes(selectedSizes);
    handleMobileFilter(filterQuery);
  };
  const handleReset = () => {
    setMinPrice(0);

    setSelectedColors([]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedSortOption("");
    setIsMobileFilterOpen(false);
  };

  useEffect(() => {
    if (!loading && maxPrices && selectedCurrency) {
      let newMaxPrice = 10000;
      if (selectedCurrency === "BDT") {
        newMaxPrice = maxPrices.maxBdPrice;
      } else if (selectedCurrency === "AED") {
        newMaxPrice = maxPrices.maxDubaiPrice;
      }
      setMaxPrice(newMaxPrice);
    }
  }, [loading, maxPrices]);
  // useEffect(() => {
  //   handleSizes(selectedSizes);
  // }, [selectedSizes]);
  if (isLoading || loading || lOding) {
    return <Loader />;
  }
  return (
    <form
      onSubmit={handleFilter}
      className="mobileFiter flex justify-center items-center md:hidden mb-6"
    >
      <button
        className={`w-[16rem] mobileFiter-btn inline-flex justify-center items-center py-[1.13rem] px-[0.94rem] gap-[1.06rem] border-2   ${
          Page === "featured"
            ? "text-white border-white"
            : "text-[#fff] border-[#fff] "
        } font-bold text-[1.06rem] leading-[107%] tracking-[0.011rem] uppercase courierNew `}
        onClick={openMobileFilter}
      >
        Filter and Sort
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
        >
          <path
            d="M15.875 2.5H13.5687C13.2875 1.20625 12.1625 0.25 10.8125 0.25C9.4625 0.25 8.3375 1.20625 8.05625 2.5H0.125V3.625H8.05625C8.3375 4.91875 9.4625 5.875 10.8125 5.875C12.1625 5.875 13.2875 4.91875 13.5687 3.625H15.875V2.5ZM10.8125 4.75C9.85625 4.75 9.125 4.01875 9.125 3.0625C9.125 2.10625 9.85625 1.375 10.8125 1.375C11.7688 1.375 12.5 2.10625 12.5 3.0625C12.5 4.01875 11.7688 4.75 10.8125 4.75ZM0.125 11.5H2.43125C2.7125 12.7937 3.8375 13.75 5.1875 13.75C6.5375 13.75 7.6625 12.7937 7.94375 11.5H15.875V10.375H7.94375C7.6625 9.08125 6.5375 8.125 5.1875 8.125C3.8375 8.125 2.7125 9.08125 2.43125 10.375H0.125V11.5ZM5.1875 9.25C6.14375 9.25 6.875 9.98125 6.875 10.9375C6.875 11.8938 6.14375 12.625 5.1875 12.625C4.23125 12.625 3.5 11.8938 3.5 10.9375C3.5 9.98125 4.23125 9.25 5.1875 9.25Z"
            fill={`${Page === "featured" ? "white" : "white"}`}
            fillOpacity="0.44"
          />
        </svg>
      </button>
      <div
        className={`fixed custom-scrollbar top-0 left-0 bg-white overflow-y-auto h-screen w-[300px] transform transition-transform duration-500 ease-in-out z-[999] p-0 flex flex-col justify-between ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col px-[0.88rem]">
          <div className="flex flex-row justify-between items-center py-[1.06rem]">
            <h2 className="text-[#191E1B] courierNew text-[1.25rem] font-bold leading-[77.5%] tracking-[0.012rem]">
              Filter and Sort
            </h2>
            <button className="text-[#191E1B]" onClick={closeMobileFilter}>
              <BiX size={25} />
            </button>
          </div>
          <hr className="h-[0.07rem] border-t-0 bg-black opacity-[0.21]" />
          <div className="py-[0.88rem]">
            <div
              onClick={toggleSort}
              className="flex justify-between items-center cursor-pointer text-[#191E1B]"
            >
              <h3 className="courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                Sort
              </h3>
              <button className={`${isSortOpen ? "rotate-180" : "rotate-0"}`}>
                <BiChevronDown size={25} />
              </button>
            </div>
            <Collapse
              isOpened={isSortOpen}
              className={`collapsible-content ${isSortOpen ? "opened" : ""}`}
            >
              <div className="flex dropdown_sort flex-col">
                {sortOptions.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full h-[3rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem]"
                  >
                    <input
                      type="radio"
                      id={`radio-${index}`}
                      name="sortOption"
                      checked={selectedSortOption === option.value}
                      onChange={() => handleSortOptionSelect(option.value)}
                      className="mr-2"
                    />
                    <span
                      className={`flex-1  courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem] ${
                        selectedSortOption === option.value
                          ? "courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]"
                          : "courierNew text-[1rem] font-normal leading-[77.5%] tracking-[0.012rem]"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </Collapse>
          </div>
          <hr className="h-[0.07rem] border-t-0 bg-black opacity-[0.21]" />

          {Page !== "ss23" && (
            <div className="py-[0.88rem]">
              <div
                onClick={toggleCategory}
                className="flex justify-between items-center cursor-pointer text-[#191E1B]"
              >
                <h3 className="courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                  Category
                </h3>
                <button
                  className={`${isCategoryOpen ? "rotate-180" : "rotate-0"}`}
                >
                  <BiChevronDown size={25} />
                </button>
              </div>
              <Collapse
                isOpened={isCategoryOpen}
                className={`collapsible-content ${
                  isCategoryOpen ? "opened" : ""
                }`}
              >
                <div className="flex dropdown flex-col">
                  {categories?.map((category, index) => (
                    <label
                      key={index}
                      className="flex items-center w-full h-[3rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] "
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        checked={selectedCategories.includes(
                          category?.category
                        )}
                        onChange={() =>
                          handleCategorySelect(category?.category)
                        }
                        className="mr-2"
                      />
                      <span
                        className={`flex-1 uppercase ${
                          selectedCategories.includes(category?.category)
                            ? "courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]"
                            : "courierNew text-[1rem] font-normal leading-[77.5%] tracking-[0.012rem]"
                        }`}
                      >
                        {category?.category}
                      </span>
                    </label>
                  ))}
                </div>
              </Collapse>
            </div>
          )}

          <hr className="h-[0.07rem] border-t-0 bg-black opacity-[0.21]" />

          <div className="py-[0.88rem]">
            <div
              onClick={togglePrice}
              className="flex justify-between items-center cursor-pointer text-[#191E1B]"
            >
              <h3 className="courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                Price
              </h3>
              <button className={`${isPriceOpen ? "rotate-180" : "rotate-0"}`}>
                <BiChevronDown size={25} />
              </button>
            </div>
            <Collapse
              isOpened={isPriceOpen}
              className={`collapsible-content ${isPriceOpen ? "opened" : ""}`}
            >
              <div className="flex flex-col">
                {" "}
                <div className="relative">
                  <div className="pt-4 pb-14  w-full">
                    <div className="w-full h-[3rem] pb-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] price_range_slider">
                      <label
                        htmlFor="minPrice"
                        className="courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]"
                      >
                        Min Price: ${minPrice}
                      </label>
                      <input
                        type="number"
                        id="minPrice"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="w-full mt-1 pl-2 appearance-none bg-gray-200 h-10 rounded"
                      />
                    </div>
                    <div className="w-full h-[3rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] price_range_slider">
                      <label
                        htmlFor="maxPrice"
                        className="courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]"
                      >
                        Max Price: ${maxPrice}
                      </label>
                      <input
                        type="number"
                        id="maxPrice"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="w-full mt-1 pl-2 appearance-none bg-gray-200 h-10 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
          <hr className="h-[0.07rem] border-t-0 bg-black opacity-[0.21]" />
          <div className="py-[0.88rem]">
            <div
              onClick={toggleColor}
              className="flex justify-between items-center cursor-pointer text-[#191E1B]"
            >
              <h3 className="courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                Color
              </h3>
              <button className={`${isColorOpen ? "rotate-180" : "rotate-0"}`}>
                <BiChevronDown size={25} />
              </button>
            </div>
            <Collapse
              isOpened={isColorOpen}
              className={`collapsible-content ${isColorOpen ? "opened" : ""}`}
            >
              <div className="flex dropdown flex-col">
                {colors?.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full h-[3rem] cursor-pointer py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] "
                  >
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      checked={selectedColors.includes(category)}
                      onChange={() => handleColorSelect(category)}
                      className="mr-2 cursor-pointer"
                    />
                    <span
                      className={`flex-1 uppercase ${
                        selectedColors.includes(category)
                          ? "courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]"
                          : "courierNew text-[1rem] font-normal leading-[77.5%] tracking-[0.012rem]"
                      }`}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </Collapse>
          </div>
          <hr className="h-[0.07rem] border-t-0 bg-black opacity-[0.21]" />
          <div className="py-[0.88rem]">
            <div
              onClick={toggleSize}
              className="flex justify-between items-center cursor-pointer text-[#191E1B]"
            >
              <h3 className="courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]">
                Size
              </h3>
              <button className={`${isSizeOpen ? "rotate-180" : "rotate-0"}`}>
                <BiChevronDown size={25} />
              </button>
            </div>
            <Collapse
              isOpened={isSizeOpen}
              className={`collapsible-content ${isSizeOpen ? "opened" : ""}`}
            >
              <div className="flex dropdown flex-col">
                {demoSize.map((category, index) => (
                  <label
                    key={index}
                    className="flex items-center w-full h-[3rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] "
                  >
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      checked={selectedSizes.includes(category)}
                      onChange={() => handleSizeSelect(category)}
                      className="mr-2"
                    />
                    <span
                      className={`flex-1 uppercase ${
                        selectedSizes.includes(category)
                          ? "courierNew text-[1rem] font-bold leading-[77.5%] tracking-[0.012rem]"
                          : "courierNew text-[1rem] font-normal leading-[77.5%] tracking-[0.012rem]"
                      }`}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </Collapse>
          </div>
          <hr className="h-[0.07rem] border-t-0 bg-black opacity-[0.21]" />
        </div>
        <div className="justify-end px-[0.88rem] py-[4rem]">
          <div className="flex items-center gap-[1.06rem]">
            <div className="clear-btn ">
              <button
                onClick={handleReset}
                type="reset"
                className="border-2 border-[#00000070] text-[#00000070] font-bold text-[.93rem] leading-[107%] tracking-[0.011rem] uppercase courierNew py-[1.06rem] px-4 rounded-full"
              >
                Clear All
              </button>
            </div>
            <div className="view-filter">
              <button
                type="submit"
                className="text-white bg-[#38453E] font-bold text-[.93rem] leading-[107%] tracking-[0.011rem] uppercase courierNew py-[1.06rem] px-4 rounded-full"
              >
                View Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MobileFilter;
