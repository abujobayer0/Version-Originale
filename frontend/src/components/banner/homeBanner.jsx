import { Link } from "react-router-dom";
import img from "../../assets/img/homeBanner.webp";
import img2 from "../../assets/img/homeBanner-2.webp";
import { useCurrency } from "../../context/CurrencyContext";
const homeBanner = () => {
  const { selectedCurrency } = useCurrency();
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  return (
    <section>
      <div className="py-[2.56rem] xl:py-[5.62rem] px-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <article className="relative">
            <figure className="relative m-auto overflow-hidden w-full">
              <img
                src={img}
                alt="Banner-1"
                className="w-full max-w-full transition-all duration-300 ease-linear block h-auto md:h-[500px] xl:h-[600px] 3xl:h-[650px] scale-100 object-cover bg-top hover:scale-110"
              />
            </figure>
            <figcaption
              className="absolute top-[47%] left-[50%]
                            transform translate-x-[-50%] translate-y-[-50%] text-center w-full inline-flex flex-col items-center gap-6"
            >
              <h2 className="text-white text-[2.56rem] font-bold leading-[77.5%] tracking-[0.0026rem] euroWide">
                SS23
              </h2>
              <Link
                to={`/${countryRoute}/ss23`}
                className="border-2 border-white text-white inline-flex justify-center items-center w-[13rem] h-[3rem] p-[.5rem] gap-[.5rem] text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
              >
                Shop Collection
              </Link>
            </figcaption>
          </article>
          <article className="relative">
            <figure className="relative m-auto overflow-hidden w-full">
              <img
                src={img2}
                alt="Banner-2"
                className="w-full max-w-full transition-all duration-300 ease-linear block h-auto md:h-[500px] xl:h-[600px] 3xl:h-[650px]  scale-100 object-cover bg-top hover:scale-110"
              />
            </figure>
            <figcaption
              className="absolute top-[47%] left-[50%]
                            transform translate-x-[-50%] translate-y-[-50%] text-center w-full inline-flex flex-col items-center gap-6"
            >
              <h2 className="text-white text-[2.56rem] font-bold leading-[77.5%] tracking-[0.0026rem] euroWide">
                FW23
              </h2>
              <Link
                to={`/${countryRoute}/fw23`}
                className="border-2 border-white text-white inline-flex justify-center items-center w-[13rem] h-[3rem] p-[.5rem] gap-[.5rem] text-[1.06rem] font-bold leading-[122.5%] tracking-[0.01rem] courierNew"
              >
                Shop Collection
              </Link>
            </figcaption>
          </article>
        </div>
      </div>
    </section>
  );
};

export default homeBanner;
