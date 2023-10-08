import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useCurrency } from "../../context/CurrencyContext";

const Sort = ({ Page, handleRequestSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCurrency } = useCurrency();
  const [selectedSort, setSelectedSort] = useState("newest");
  const sortingOptions = [
    { value: "best-selling", label: "Best Selling" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-low-to-high", label: "Price Low to High" },
    { value: "price-high-to-low", label: "Price High to Low" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    setIsOpen(false);
    handleRequestSort({ sort: value, selectedCurrency });
  };

  return (
    <div className="relative hidden md:inline-block text-left">
      <div>
        <button
          type="button"
          className={`inline-flex justify-center items-center py-[0.94rem] px-[0.94rem] border-2 font-bold text-[1.06rem] leading-[107%] tracking-[0.011rem] uppercase courierNew ${
            Page === "featured"
              ? "text-white border-white"
              : "border-[#fff] text-[#fff] "
          }`}
          onClick={toggleDropdown}
        >
          <span>Sort By</span>
          <BiChevronDown
            size={25}
            className={`ml-2 ${isOpen ? "transform rotate-180" : ""}`}
          />
        </button>
      </div>
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#E8EAE5]"
          onClick={toggleDropdown}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-4 py-2">
              <ul className="mt-2 space-y-2">
                {sortingOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => handleSortChange(option.value)}
                      className={`${
                        option.value === selectedSort
                          ? "bg-[#00000038] "
                          : "hover:bg-[#00000038] "
                      } group flex text-[#00000070] rounded-md items-center w-full px-2 py-2 font-bold text-[0.94rem] courierNew`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sort;
