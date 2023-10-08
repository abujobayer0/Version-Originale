import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useCurrency } from "../../context/CurrencyContext";
import { useEffect, useState } from "react";

const contact = ({ children }) => {
  const { selectedCurrency } = useCurrency();
  const [contact, setContact] = useState(true);
  const handleClick = () => {
    setContact(false);
  };
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=" relative px-0 lg:px-[7rem]  md:pt-[5.13rem] pb-[3rem] lg:pb-[4.35rem]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-row-reverse relative items-start w-full justify-between mb-[2.3rem]">
        <div className="relative hidden md:block top-12 right-0 w-[350px] h-44">
          <div>
            <ul className="flex items-end  flex-col gap-[1.25rem]">
              {contact === true ? (
                <NavLink
                  to={`/${countryRoute}/contact`}
                  className="inline-flex uppercase items-center justify-center  text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
                >
                  Contact US
                </NavLink>
              ) : (
                <NavLink
                  to={`/${countryRoute}/contact/us`}
                  className="inline-flex uppercase items-center justify-center  text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
                >
                  Contact US
                </NavLink>
              )}
              <NavLink
                to={`/${countryRoute}/contact/faq`}
                onClick={handleClick}
                className="inline-flex uppercase items-center justify-center  text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
              >
                FAQs
              </NavLink>

              <NavLink
                onClick={handleClick}
                to={`/${countryRoute}/contact/shipping-return`}
                className="inline-flex items-center uppercase justify-center  text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
              >
                Shipping & Returns
              </NavLink>
            </ul>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default contact;
