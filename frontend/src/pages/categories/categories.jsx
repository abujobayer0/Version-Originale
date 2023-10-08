import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../../components/loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";

const Categories = () => {
  const { data: categories, isLoading } = useGetData("/categories");
  const { selectedCurrency, locationLoading } = useCurrency();

  if (isLoading || locationLoading) {
    return <Loader />;
  }

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  return (
    <div className=" px-6 lg:px-[6rem] xl:px-[12rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem]">
      <div className="flex items-center justify-between mb-[2.3rem]">
        <h2 className="text-[#2c332e] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center">
          Categories
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isLoading &&
          categories?.map((item, indx) => (
            <Link key={indx} to={`/${countryRoute}/category/${item.category}`}>
              <div className="flex items-center justify-between cursor-pointer w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#38453440] mt-[1.38rem]">
                <span className="text-black text-opacity-[0.76] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none">
                  {item.category} <span>({item?.totalProducts})</span>
                </span>
                <AiOutlineArrowRight />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Categories;
