import { useState } from "react";

const useNewsletterSubscription = () => {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const handleSubscribe = (email) => {
    fetch("https://test-originale.onrender.com/newsletter", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then(() => {
        setIsNewsletterOpen(false);
      });
  };

  return { isNewsletterOpen, setIsNewsletterOpen, handleSubscribe };
};

export default useNewsletterSubscription;
