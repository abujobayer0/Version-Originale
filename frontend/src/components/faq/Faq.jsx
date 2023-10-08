import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Collapse from "react-collapse";
import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";

const Accordion = ({ title, content }) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleAccordion = () => {
    setIsOpened(!isOpened);
  };

  return (
    <div className="accordion mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16">
      <div className="accordion-header pb-4  px-0 max-w-5xl mx-auto">
        <div
          onClick={toggleAccordion}
          className="cursor-pointer flex items-center justify-between transition-colors py-5 md:py-6 px-6 md:px-8 lg:px-10 bg-[#839f9099] helveticaNowDisplay"
        >
          <span>{title}</span>
          {isOpened ? <FaMinus /> : <FaPlus />}
        </div>
        <Collapse isOpened={isOpened} className="opacity-100 h-auto">
          <div className="accordion-content pb-6 md:pb-7 leading-7 text-sm text-white/80 pt-5 border-t border-gray-300 px-6 md:px-8 lg:px-10 bg-[#839f9099] helveticaNowDisplay">
            {content}
          </div>
        </Collapse>
      </div>
    </div>
  );
};
const Faq = () => {
  const { selectedCurrency } = useCurrency();
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  return (
    <div className=" w-full min-h-screen">
      <div
        className="flex justify-center p-6 md:p-10 2xl:p-8 relative bg-no-repeat bg-center bg-cover overflow-hidden my-12 faq-banner"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80")',
        }}
      >
        <div className="w-full flex flex-col items-center justify-center relative z-10 py-8 lg:py-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center capitalize courierNew">
            <span className="font-satisfy block font-normal mb-3 uppercase euroWide">
              explore
            </span>
            Frequently Asked Questions
          </h2>
          <div
            className="flex px-5 py-3 text-white  mt-4"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to={`/${countryRoute}/contact`}
                  className="inline-flex items-center text-base font-medium  text-white"
                >
                  <svg
                    className="w-3 h-3 mr-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 mx-1 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <Link
                    to={`/${countryRoute}/contact/faq`}
                    className="ml-1 text-base font-medium  md:ml-2 text-white"
                  >
                    Faq
                  </Link>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="faq-accordion text-white">
        {/* Accordion 1 */}
        <Accordion
          title="How to contact with Customer Service?"
          content="Our Customer Experience Team is available 7 days a week and we offer 2 ways to get in contact.Email and Chat . We try to reply quickly, so you need not to wait too long for a response!."
        />

        {/* Accordion 2 */}
        <Accordion
          title="Website response taking time, how to improve?"
          content="At first, Please check your internet connection . We also have some online video tutorials regarding this issue . If the problem remains, Please Open a ticket in the support forum."
        />

        {/* Accordion 3 */}
        <Accordion
          contentClassName="text-white"
          title="How do I create an account?"
          content="If you want to open an account for personal use you can do it over the phone or online. Opening an account online should only take a few minutes."
        />
      </div>
    </div>
  );
};

export default Faq;
