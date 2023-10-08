import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import Swal from "sweetalert2";
import useNewsletterSubscription from "../customHooks/newsletterHook/newsLetterHook";
import { useCurrency } from "../context/CurrencyContext";

const footer = () => {
  const { handleSubscribe } = useNewsletterSubscription();
  const { selectedCurrency } = useCurrency();

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  const handleSubscrib = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    handleSubscribe(email);
    Swal.fire("You have successfully subscribed");
    form.reset();
  };

  return (
    <footer>
      <div className="container px-4 lg:px-8 xl:px-[7rem]">
        <div className="flex items-start flex-col lg:flex-row lg:justify-between gap-6 pt-[2.5rem] pb-[2.75rem] xl:pt-[5.75rem] xl:pb-[5.94rem] xl:gap-20 3xl:gap-[6.5rem]">
          <div>
            <h2 className="text-white text-[1.23rem] font-bold leading-[122.5%] tracking-[0.011rem] euroWide mb-[1.44rem]">
              Connect
            </h2>
            <div className="flex flex-col gap-[0.63rem]">
              <Link
                to="#"
                className="inline-flex items-center justify-center gap-[0.69rem] bg-white bg-opacity-[0.12] py-[0.94rem] pl-[1.06rem] pr-[1.81rem] text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew w-[14rem]"
              >
                <span>
                  <BsInstagram size={20} />
                </span>
              </Link>
              <Link
                to="#"
                className="inline-flex items-center justify-center gap-[0.69rem] bg-white bg-opacity-[0.12] py-[0.94rem] pl-[1.06rem] pr-[1.81rem] text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew w-[14rem]"
              >
                <span>
                  <BsFacebook size={20} />
                </span>
              </Link>
              <Link
                to="#"
                className="inline-flex items-center justify-center gap-[0.69rem] bg-white bg-opacity-[0.12] py-[0.94rem] pl-[1.06rem] pr-[1.81rem] text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew w-[14rem]"
              >
                <span>
                  <BsTiktok size={20} />
                </span>
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-white text-[1.23rem] font-bold leading-[122.5%] tracking-[0.011rem] euroWide mb-[1.44rem]">
              Newsletter
            </h2>
            <p className="text-white text-opacity-[0.59] text-[1rem] font-bold leading-[95.5%] tracking-[0.01rem] courierNew w-[18rem] xl:w-[25rem] 3xl:w-[28.38rem] mb-[1.44rem]">
              Lorem ipsum dolor sit amet consectetur Eget mauris nunc integer.
            </p>
            <form onSubmit={handleSubscrib}>
              <input
                type="text"
                name="email"
                placeholder="Your email address"
                className="flex w-full xl:w-[24rem] 3xl:w-[28.38rem] h-[3.56rem] items-center py-[0.81rem] pl-[1.69rem] pr-[0.81rem] bg-white bg-opacity-[0.12] text-white text-opacity-[0.27] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew outline-none border-none mb-[0.81rem]"
              />
              <button
                type="submit"
                className="flex justify-center w-full xl:w-[24rem] h-[3.56rem] items-center p-[0.81rem] bg-white text-black text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew outline-none border-none"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-white text-[1.23rem] font-bold leading-[122.5%] tracking-[0.011rem] euroWide mb-[1.44rem]">
              Menu
            </h2>
            <ul className="flex flex-col gap-[1.25rem]">
              <li>
                <Link
                  to={`/${countryRoute}/contact`}
                  className="inline-flex items-center justify-center  text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
                >
                  Contact US
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/contact/faq`}
                  className="inline-flex items-center justify-center  text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to={`/${countryRoute}/contact/shipping-return`}
                  className="inline-flex items-center justify-center  text-white text-opacity-[0.59] text-[1rem] font-bold leading-[77.5%] tracking-[0.01rem] courierNew"
                >
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default footer;
