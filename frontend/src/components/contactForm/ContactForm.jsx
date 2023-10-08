import { useState } from "react";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [feedback, setFeedback] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://test-originale.onrender.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          email: email,
          orderNumber: orderNumber,
          feedback: feedback,
          reason: reason,
        }),
      }).then(async (res) => {
        const data = await res.json();

        if (res.ok) {
          toast.success("Message sent successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Failed to send message.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setEmail("");
      setOrderNumber("");
      setFeedback("");
      setReason("");
    }
  };
  return (
    <div className="flex flex-col  items-start gap-[30px] w-full">
      <div className="border-[#9CA3AF] flex flex-col gap-[27px] p-[30px] w-full md:w-[60%]  border-b-2 md:border">
        <h2 className="text-[#fff] w-full text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-start">
          Contact US
        </h2>

        <p className="text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew ">
          Customer service support, inquiries related to: prices and currency,
          order and preorder payment, order status, shipment info, return and
          exchange.
        </p>
        <span className="flex flex-col gap-[13px] justify-start items-start">
          <h3 className="text-[#fff] text-base font-bold leading-[98%] tracking-[0.01rem] courierNew cursor-pointer">
            CALL
          </h3>
          <p className="text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[98%] tracking-[0.01rem]  courierNew cursor-pointer underline underline-offset-4 ">
            +8801234567890
          </p>
          <p className="text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[98%] tracking-[0.01rem]  courierNew cursor-pointer underline underline-offset-4 ">
            +8801234567890
          </p>
        </span>
        <span className="flex flex-col gap-[13px] justify-start items-start">
          <h3 className="text-[#fff] text-base font-bold leading-[98%] tracking-[0.01rem]  courierNew cursor-pointer">
            EMAIL
          </h3>
          <p className="text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[98%] tracking-[0.01rem] underline underline-offset-4  courierNew cursor-pointer">
            version.originale@gmail.com
          </p>
        </span>
        <span className="flex flex-col gap-[13px] justify-start items-start">
          <h3 className="text-[#fff] text-base font-bold leading-[98%] tracking-[0.01rem]  courierNew cursor-pointer">
            WORKING HOURS
          </h3>
          <p className="text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[98%] tracking-[0.01rem]  courierNew cursor-pointer">
            Available Sun-Fri 9am-6.00am BDT
          </p>
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-[#9CA3AF] flex flex-col gap-[27px] p-[30px] w-full  border-b-2 md:border"
      >
        <h2 className="text-[#fff] w-full text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-start">
          send us an enquery
        </h2>

        <div className="flex flex-col md:flex-row w-full md:gap-[14px] items-start justify-start">
          <span className="flex flex-col w-full">
            <div className="flex items-center w-full h-[4rem]  gap-[0.63rem] border-2 border-[#9CA3AF]">
              <input
                type="input"
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-transparent text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none  py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full custom-placeholder-color h-auto"
                placeholder="First Name (optional)"
                value={firstName}
              />
            </div>
            <div className="flex items-center w-full h-[4rem]  gap-[0.63rem] border-2 border-[#9CA3AF] mt-[1.38rem]">
              <input
                type="input"
                className="bg-transparent text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none  py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full custom-placeholder-color h-auto"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number (optional)"
              />
            </div>
            <div className="flex items-center w-full h-[4rem]  gap-[0.63rem] border-2 border-[#9CA3AF] mt-[1.38rem]">
              <input
                type="input"
                className="bg-transparent text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none  py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full custom-placeholder-color h-auto"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enquery Reason (optional)"
              />
            </div>
          </span>
          <span className="flex  mt-[1.38rem] md:mt-0 w-full flex-col justify-start items-start">
            <div className="flex items-center w-full h-[4rem]  gap-[0.63rem] border-2 border-[#9CA3AF] ">
              <input
                type="input"
                className="bg-transparent text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full custom-placeholder-color h-auto"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name (optional)"
              />
            </div>{" "}
            <div className="flex items-center w-full h-[4rem]  gap-[0.63rem] border-2 border-[#9CA3AF] mt-[1.38rem]">
              <input
                type="input"
                className="bg-transparent text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full custom-placeholder-color h- auto"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address (optional)"
              />
            </div>{" "}
            <div className="flex items-center w-full h-[4rem]  gap-[0.63rem] border-2 border-[#9CA3AF] mt-[1.38rem]">
              <input
                type="input"
                className="bg-transparent text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full custom-placeholder-color h- auto"
                name="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Order Number (optional)"
              />
            </div>
          </span>
        </div>

        <div className="flex items-center w-full gap-[0.63rem] border-2 border-[#9CA3AF]">
          <textarea
            name="feedback"
            cols="30"
            className="bg-transparent text-[#9CA3AF] dark:text-[#9ca3af] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full custom-placeholder-color h- auto"
            rows="10"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your message (360 characters max)."
          ></textarea>
        </div>
        <div className="flex items-center w-full gap-[0.63rem] ">
          <button className="text-[#fff] bg-[#38453E] border-2 border-[#9CA3AF] text-base font-bold leading-[122.5%] tracking-[0.01rem]  courierNew  outline-none py-[1.75rem] pl-[1.5rem] pr-[2rem] w-full md:w-1/2 custom-placeholder-color h- auto uppercase">
            Submit form
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
