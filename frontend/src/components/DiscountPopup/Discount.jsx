import { useEffect } from "react";
import newsLetterImg from "../../assets/img/look-book/gallery-1.webp";
import { BiX } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import useNewsletterSubscription from "../../customHooks/newsletterHook/newsLetterHook";
import Swal from "sweetalert2";

const DiscountPopup = () => {
  const {
    isNewsletterOpen,
    setIsNewsletterOpen,
    handleSubscribe,
  } = useNewsletterSubscription();
  useEffect(() => {
    setIsNewsletterOpen(true);
  }, []);
  useEffect(() => {
    const body = document.querySelector("body");
    if (isNewsletterOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isNewsletterOpen]);

  const newsLetterClose = () => {
    setIsNewsletterOpen(false);
  };
  const handleSubscrib = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    handleSubscribe(email);
    Swal.fire("You have successfully subscribed");
  };
  return (
    <>
      {isNewsletterOpen && (
        <div className="fixed bg-black bg-opacity-70 inset-0 z-[9999] cursor-pointer p-4 md:p-5">
          <div className="relative w-full h-full mx-auto">
            <div className="w-full md:w-auto absolute left-1/2 transform -translate-x-1/2 shadow-xl h-auto max-h-full top-1/2 -translate-y-1/2 rounded-lg">
              <div className="w-full sm:w-[450px] md:w-[500px] lg:w-[550px] xl:w-[1020px] grid grid-cols-1 xl:grid-cols-2 items-center justify-center max-w-full h-full max-h-[550px] bg-white overflow-hidden rounded-md">
                <div className="hidden xl:inline-block xl:col-span-1">
                  <img
                    src={newsLetterImg}
                    alt="newsletter"
                    className="w-full h-full object-cover bg-top"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col px-5 py-7 sm:p-10 md:p-12  xl:p-14 text-center w-full xl:col-span-1">
                  <h4 className="uppercase font-semibold text-xs sm:text-sm text-body mb-2 lg:mb-4">
                    subscribe now
                  </h4>
                  <h2 className="text-heading text-lg sm:text-xl md:text-2xl leading-8 font-bold mb-5 sm:mb-7 md:mb-9">
                    And Get Offer On New Collection
                  </h2>
                  <p className="text-body text-sm leading-6 md:leading-7">
                    Do subscribe the ChawkBazar to receive updates on new
                    arrivals, special offers & our promotions
                  </p>
                  <form
                    onSubmit={handleSubscrib}
                    className="pt-8 sm:pt-10 md:pt-14 mb-1 sm:mb-0"
                  >
                    <div className="w-full">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Write your email here"
                        className="py-2 px-4 md:px-5 w-full appearance-none transition ease-in-out border text-input text-xs lg:text-sm font-body placeholder-body min-h-12 duration-200 border-gray-300 focus:outline-none focus:border-heading md:h-12 lg:px-7 h-12 lg:h-14 text-center bg-gray-50 rounded-md"
                        autoComplete="off"
                        spellCheck="false"
                        aria-invalid="false"
                      />
                    </div>
                    <button
                      data-variant="flat"
                      type="submit"
                      className="text-[13px] md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-body text-center justify-center border-0 border-transparent placeholder-white focus-visible:outline-none focus:outline-none rounded-md  bg-[#212121] text-white px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-gray-600 hover:shadow-cart w-full h-12 lg:h-14 mt-3 sm:mt-4"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
              <button
                aria-label="Close panel"
                onClick={newsLetterClose}
                className="fixed z-10 inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white shadow text-gray-600 transition duration-200 focus:outline-none focus:text-gray-800 focus:shadow-md hover:text-gray-800 hover:shadow-md -top-3 md:-top-4 -right-3  md:-right-4 "
              >
                <BiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountPopup;
