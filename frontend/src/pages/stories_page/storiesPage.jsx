import { useEffect, useState } from "react";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { Link } from "react-router-dom";
import Pagination from "../../components/pagination/pagination";
import { useGetPaginationData } from "../../customHooks/useGetPaginationData/useGetPaginationData";
import Loader from "../../components/loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";
const StoriesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedCurrency } = useCurrency();

  const { data: storiesData, isLoading } = useGetPaginationData(
    "/story/all",
    currentPage
  );
  const { data: storyTimeLine, isLoading: loading } = useGetData(
    "/story/timeline"
  );
  const { data: filteredStory, isLoading: loadingData } = useGetData(
    `/filtered/stories?year=${selectedYear}&&month=${selectedMonth}`
  );

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleYearClick = (year) => {
    if (selectedYear === year) {
      setIsOpen(false);
    } else {
      setSelectedYear(year);
      setSelectedMonth(null);
    }
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setIsOpen(false);
  };
  const handleMonthandYear = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  if (isLoading || loading || loadingData) {
    return <Loader />;
  }

  const month_year_data = !loading && storyTimeLine[0].dynamicArray;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const stories =
    selectedMonth && selectedYear ? filteredStory : storiesData?.stories || [];
  const pageNumbers =
    selectedMonth && selectedYear ? null : storiesData?.pageNumbers || [];

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  return (
    <section>
      <div className=" px-6 lg:px-[2rem]  xl:px-[2rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem]">
        <div className="flex items-center justify-between mb-[2.3rem]">
          <h2 className="text-[#fff] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center">
            here are some stories for you
          </h2>
        </div>
        <div className="flex flex-col w-full lg:flex-row">
          <div className="w-1/6  border-2 hidden lg:block justify-center items text-[#fff] border-[#fff] h-auto mx-[42px]">
            <div className="border-b-2  border-[#fff]">
              <h1 className="text-center py-[40px] xl:text-[20px] leading-[77.5%] font-bold tracking-[0.012rem] text-[#fff] uppercase courierNew">
                Archives
              </h1>
            </div>
            <div className="flex justify-center items-center pl-16 2xl:pl-4  lg:pr-16 mt-[40px] flex-col gap-[52px]">
              {month_year_data?.map((item, indx) => (
                <div key={indx}>
                  <h1
                    className={`euroWide ${
                      selectedYear === item.year && "text-white"
                    }`}
                  >
                    {item.year}
                  </h1>
                  <ul className="ml-10">
                    {item.months.map((mnt, indx) => (
                      <li
                        onClick={() => handleMonthandYear(mnt, item.year)}
                        className={`py-2 text-start cursor-pointer  xl:text-[17px] leading-[77.5%] font-bold tracking-[0.012rem] text-[#fff] uppercase courierNew ${
                          selectedMonth === mnt &&
                          selectedYear === item.year &&
                          "text-white"
                        }`}
                        key={indx}
                      >
                        {mnt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mb-[2.3rem] border-2 flex lg:hidden text-[#fff] border-[#fff]">
            <div className="relative z-50 w-full inline-block text-left">
              <div>
                <span className="">
                  <button
                    type="button"
                    className="inline-flex  justify-start w-full px-4 py-2 text-sm font-medium text-white border rounded-md  "
                    onClick={togglePicker}
                  >
                    {selectedYear && selectedMonth ? (
                      <div className="flex flex-col justify-start w-full items-start">
                        <h1 className="euroWide">{selectedYear}</h1>
                        <h1 className="py-2 text-start cursor-pointer  xl:text-[17px] leading-[77.5%] font-bold tracking-[0.012rem] text-[#fff] uppercase courierNew">
                          {selectedMonth}
                        </h1>
                      </div>
                    ) : (
                      <h1 className="py-2 text-start cursor-pointer  xl:text-[17px] leading-[77.5%] font-bold tracking-[0.012rem] text-[#fff] uppercase courierNew">
                        Select a month and year
                      </h1>
                    )}
                  </button>
                </span>
              </div>
              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-full md:w-56 rounded-md shadow-lg">
                  <div className="py-2 px-2 bg-[#E8EAE5] rounded-md shadow-xs">
                    {month_year_data.map((yearData, index) => (
                      <div key={index}>
                        <button
                          onClick={() => handleYearClick(yearData.year)}
                          className={`block w-full euroWide px-4 text-start py-2 text-sm text-gray-700 rounded-lg hover:bg-[#00000038] ${
                            selectedYear === yearData.year && "bg-[#00000038]"
                          } hover:text-gray-900`}
                        >
                          {yearData.year}
                        </button>
                        {selectedYear === yearData.year && (
                          <div className="border-t border-gray-200 mt-2">
                            {yearData.months.map((month, monthIndex) => (
                              <button
                                key={monthIndex}
                                onClick={() => handleMonthClick(month)}
                                className={`block mt-1  w-full  px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-[#00000038] ${
                                  selectedMonth === month && "bg-[#00000038]"
                                } hover:text-gray-900`}
                              >
                                <h1 className="py-2 text-start cursor-pointer  xl:text-[17px] leading-[77.5%] font-bold tracking-[0.012rem] text-[#000] uppercase courierNew">
                                  {month}
                                </h1>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid  w-full grid-cols-1  md:grid-cols-2 gap-[0.56rem] md:gap-[0.88rem]">
            {stories?.map((story, index) => (
              <Link
                key={index}
                className="xl:z-50"
                to={`/${countryRoute}/story/${story._id}`}
              >
                <div className="story  relative">
                  <div className="relative">
                    <img
                      src={story?.image}
                      alt={story?.title}
                      className="xl:w-[60%]  w-full h-[450px] md:h-[350px] xl:h-[350px] object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="xl:absolute  z-10 xl:bottom-12 xl:-right-0 block px-8  py-8  w-[90%] left-0 right-0 mx-auto absolute bottom-4  xl:w-[60%]  bg-white ">
                    <h1 className="mb-4  text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl  line-clamp-2 uppercase">
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
                  <div className="opacity-0 xl:h-[250px] px-8  py-8  relative mx-auto     bg-white ">
                    <h1 className="mb-4  text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl  line-clamp-2 uppercase">
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
            ))}
          </div>
        </div>
        <div className="w-full mt-44 flex justify-center items-center">
          {pageNumbers && (
            <Pagination
              pageNumbers={pageNumbers}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      <hr className="h-[0.11rem] border-t-0 bg-black opacity-[0.21]" />
    </section>
  );
};

export default StoriesPage;
