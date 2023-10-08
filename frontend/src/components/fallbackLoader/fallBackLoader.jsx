import React from "react";

const FallBackLoader = () => {
  return (
    <>
      <div className="flex w-full bg-transparent md:hidden h-screen item-center justify-center flex-col">
        <div className="flex flex-row mx-auto space-x-4">
          <div
            className="w-12 h-12 rounded-full animate-spin
        border-x-4 border-solid border-[#fff] border-t-transparent"
          ></div>
        </div>
      </div>
    </>
  );
};

export default FallBackLoader;
