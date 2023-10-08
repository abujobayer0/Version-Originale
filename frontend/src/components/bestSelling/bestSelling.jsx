import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../loader/Loader";
import BestSellingCard from "../bestSellingCard/bestSellingCard";
import { useCurrency } from "../../context/CurrencyContext";

const MostWanted = () => {
  const { data, isLoading } = useGetData("/featured");

  const { selectedCurrency } = useCurrency();

  if (isLoading) {
    return <Loader />;
  }

  // Check if data is an array
  if (!Array.isArray(data)) {
    return <p>Data is not available.</p>;
  }

  const currentDate = new Date();

  const currentMonthProducts = data.filter((product) => {
    const productDate = new Date(product.uploadDate);
    return (
      productDate.getMonth() === currentDate.getMonth() &&
      productDate.getFullYear() === currentDate.getFullYear()
    );
  });

  let latestProducts = [];
  if (currentMonthProducts.length === 0) {
    const shuffledProducts = data.slice().sort(() => Math.random() - 0.5);
    latestProducts = shuffledProducts.slice(0, 10);
  } else {
    latestProducts = currentMonthProducts
      .sort((a, b) => {
        const dateA = new Date(a.uploadDate);
        const dateB = new Date(b.uploadDate);
        return dateB - dateA;
      })
      .slice(0, 10);
  }

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <section className="bestSelling">
      <div className=" px-6 lg:px-[4rem] pt-[2.13rem] pb-[3rem]">
        <div className="flex items-center justify-between mb-[2.3rem]">
          <h2 className="text-white text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center">
            Best Selling🔥
          </h2>
          <div className="flex items-center border-b-[0.125rem] border-white">
            <Link
              to={`/${countryRoute}/best-selling`}
              className="text-white text-sm xl:text-[1.06rem] font-bold leading-[77.5%] tracking-[0.01rem] uppercase mb-1 courierNew"
            >
              See All
            </Link>
            <span className="ml-1 mb-1 text-white">
              <MdOutlineArrowForwardIos />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-[12px] md:gap-[20px]">
          {latestProducts.map((curElem) => {
            return <BestSellingCard key={curElem._id} {...curElem} />;
          })}
        </div>
      </div>
      <hr className="h-[0.11rem] border-t-0 bg-black opacity-[0.21]" />
    </section>
  );
};

export default MostWanted;
