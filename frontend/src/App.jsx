import { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
const loaderGif = "https://i.ibb.co/8MyBSZ2/loader.gif";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);
  const initializeWishlist = () => {
    const initialWishlist = [];
    localStorage.setItem("wishlist", JSON.stringify(initialWishlist));
  };

  useEffect(() => {
    if (!localStorage.getItem("wishlist")) {
      initializeWishlist();
    }
  }, []);

  return (
    <>
      {/* <div
        className={`loader-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center  ${
          isLoading ? "z-[9999] bg-black" : "-z-[9999] bg-transparent"
        }`}
      >
        {isLoading && (
          <div className="loader">
            <img
              src={loaderGif}
              alt="loader"
              className="h-screen md:h-full object-cover"
            />
          </div>
        )}
      </div> */}
    </>
  );
};

export default App;
