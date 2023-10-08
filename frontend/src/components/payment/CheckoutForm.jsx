import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCurrency } from "../../context/CurrencyContext";

const CheckoutForm = ({
  products,
  address,
  apartment,
  city,
  country,
  firstName,
  lastName,
  phone,
  user,
  totalPrice,
  state,
  postalCode,
  discounted,
  handleStripePaymentSuccess,
  refetch,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { selectedCurrency } = useCurrency();

  const [cardError, setCardError] = useState("");
  const [clientSecret, setSecret] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (totalPrice) {
      const price = parseFloat(totalPrice).toFixed(2);
      fetch("https://test-originale.onrender.com/create-payment-intent", {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify({ price }),
      })
        .then((res) => res.json())
        .then((data) => setSecret(data.clientSecret));
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedCurrency === "BDT") {
      return toast.error("Please Select Currency to AED for Stripe Payment");
    }
    if (
      !products ||
      !address ||
      !apartment ||
      !city ||
      !country ||
      !firstName ||
      !lastName ||
      !phone ||
      !user ||
      !totalPrice ||
      !state ||
      !postalCode
    ) {
      return toast.error("please fill all the information");
    }
    if (!products || products.length === 0) {
      return toast.warn("You don't have any products for checkout");
    }

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (error) {
        setCardError(error.message);
      } else {
        setCardError("");

        const {
          paymentIntent,
          error: confirmError,
        } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || "unknown",
              name: user?.displayName || "anonynmous",
            },
          },
        });
        if (confirmError) {
          setCardError(confirmError);
        }
        if (paymentIntent?.status === "succeeded") {
          const payment_info = {
            method: "stripe",
            address: address,
            apartment: apartment,
            city: city,
            country: country,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: user?.email,
            totalPrice: totalPrice,
            currency: products[0]?.currency,
            state: state,
            postalCode: postalCode,
            order_items: products,
            date: new Date(),
            discounted: discounted,
            active_status: "on processing",
            status: [
              "packed",
              "on processing",
              "delivered",
              "return",
              "shipped",
            ],
            transiction_id: paymentIntent.id,
          };
          const backup_user_data = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            apartment: apartment,
            city: city,
            country: country,
            phone: phone,
            email: user?.email,
            postalCode: postalCode,
            state: state,
          };
          const paymentResponse = await fetch(
            `https://test-originale.onrender.com/custom/order?email=${user?.email}`,
            {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({ payment_info }),
            }
          )
            .then((res) => res.json())
            .then((data) => handleStripePaymentSuccess());

          if (!paymentResponse.ok) {
            throw new Error(
              `Request failed with status ${paymentResponse.status}`
            );
          }

          const paymentData = await paymentResponse.json();

          if (paymentData.acknowledged) {
            navigate("/user/panel");
            refetch();
          }
          const userBackupInfoResponse = await fetch(
            "https://test-originale.onrender.com/user/info",
            {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({ backup_user_data }),
            }
          );

          if (!userBackupInfoResponse.ok) {
            throw new Error(
              `User backup info request failed with status ${userBackupInfoResponse.status}`
            );
          }

          const userBackupInfoData = await userBackupInfoResponse.json();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form
        className="w-full py-4 px-4 bg-[#38453e] mt-4"
        onSubmit={handleSubmit}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button
          type="submit"
          className="flex mt-8 w-full cursor-pointer items-center justify-center rounded-md border border-transparent bg-[#2c332e] py-4 text-white focus:outline-none focus:ring-2  focus:ring-offset-2 courierNew text-[1.25rem] font-bold leading-[77.5%] tracking-[0.012rem]"
          disabled={!stripe || !clientSecret}
        >
          Confirm Order
        </button>
      </form>
      {/* {cardError && <p className="text-red-600">{cardError}</p>} */}
    </>
  );
};

export default CheckoutForm;
