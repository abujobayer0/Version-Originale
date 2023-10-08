import { Link } from "react-router-dom";
import { useCurrency } from "../../context/CurrencyContext";

const ShipingAndReturn = () => {
  const { selectedCurrency } = useCurrency();
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  return (
    <div className="container min-h-screen">
      <div
        className="flex justify-center p-6 md:p-10 2xl:p-8 relative bg-no-repeat bg-center bg-cover overflow-hidden my-12 faq-banner"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80")',
        }}
      >
        <div className="w-full flex flex-col items-center justify-center relative z-10 py-8 lg:py-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center capitalize euroWide">
            Shipping & Returns
          </h2>
          <div className="flex px-5 py-3 text-white" aria-label="Breadcrumb">
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
              <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
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
                    to={`/${countryRoute}/contact/shipping-return`}
                    className="ml-1 text-base font-medium  md:ml-2 text-white"
                  >
                    Shipping & Returns
                  </Link>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-w-5xl">
        <div className="returns flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white leading-normal curierNew">
            Returns
          </h2>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Our policy lasts 30 days. If 30 days have gone by since your
            purchase, unfortunately we can’t offer you a refund or exchange.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            To be eligible for a return, your item must be unused and in the
            same condition that you received it. It must also be in the original
            packaging.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Several types of goods are exempt from being returned. Perishable
            goods such as food, flowers, newspapers or magazines cannot be
            returned. We also do not accept products that are hazardous
            materials, or flammable liquids or gases.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Additional non-returnable items:
          </p>
          <ul>
            <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
              Gift cards
            </li>
            <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
              Downloadable software products
            </li>
            <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
              Some health and personal care items
            </li>
          </ul>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            To complete your return, we require a receipt or proof of purchase.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Please do not send your purchase back to the manufacturer.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            There are certain situations where only partial refunds are granted
            (if applicable)
          </p>
          <ul>
            <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
              Book with obvious signs of use
            </li>
            <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
              CD, DVD, VHS tape, software, video game, cassette tape, or vinyl
              record that has been opened
            </li>
            <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
              Any item not in its original condition, is damaged or missing
              parts for reasons not due to our error
            </li>
            <li className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
              Any item that is returned more than 30 days after delivery
            </li>
          </ul>
        </div>
        <div className="refunds flex flex-col gap-4 mt-6">
          <h2 className="text-lg font-bold text-white leading-normal curierNew">
            Refunds (if applicable)
          </h2>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Once your return is received and inspected, we will send you an
            email to notify you that we have received your returned item. We
            will also notify you of the approval or rejection of your refund. If
            you are approved, then your refund will be processed, and a credit
            will automatically be applied to your credit card or original method
            of payment, within a certain amount of days.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Late or missing refunds (if applicable) If you haven’t received a
            refund yet, first check your bank account again. Then contact your
            credit card company, it may take some time before your refund is
            officially posted. Next contact your bank. There is often some
            processing time before a refund is posted. If you’ve done all of
            this and you still have not received your refund yet, please contact
            us at{" "}
            <a href="mailto:web.versionoriginale@gmail.com">
              web.versionoriginale@gmail.com
            </a>
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Sale items (if applicable) Only regular priced items may be
            refunded, unfortunately sale items cannot be refunded.
          </p>
        </div>
        <div className="exchanges flex flex-col gap-4 mt-6">
          <h2 className="text-lg font-bold text-white leading-normal curierNew">
            Exchanges (if applicable)
          </h2>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            We only replace items if they are defective or damaged. If you need
            to exchange it for the same item,sent us an email at{" "}
            <a href="mailto:web.versionoriginale@gmail.com">
              web.versionoriginale@gmail.com
            </a>{" "}
            and send your item to: Address
          </p>
        </div>
        <div className="gifts flex flex-col gap-4 mt-6">
          <h2 className="text-lg font-bold text-white leading-normal curierNew">
            Gifts
          </h2>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            If the item was marked as a gift when purchased and shipped directly
            to you, you’ll receive a gift credit for the value of your return.
            Once the returned item is received, a gift certificate will be
            mailed to you.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            If the item wasn’t marked as a gift when purchased, or the gift
            giver had the order shipped to themselves to give to you later, we
            will send a refund to the gift giver and he will find out about your
            return.
          </p>
        </div>
        <div className="shipping flex flex-col gap-4 mt-6">
          <h2 className="text-lg font-bold text-white leading-normal curierNew">
            Shipping
          </h2>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            To return your product, you should mail your product to: Address
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            You will be responsible for paying for your own shipping costs for
            returning your item. Shipping Shipping costs are non-refundable. If
            you receive a refund, the cost of return shipping will be deducted
            from your refund.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            Depending on where you live, the time it may take for your exchanged
            product to reach you, may vary.
          </p>
          <p className="text-base font-normal text-white/80 leading-[124.5%] helveticaNowDisplay">
            If you are shipping an item over $75, you should consider using a
            trackable shipping service or purchasing shipping insurance. We
            don’t guarantee that we will receive your returned item.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShipingAndReturn;
