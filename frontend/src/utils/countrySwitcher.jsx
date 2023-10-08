const CurrencySwitcher = ({ selectedCurrency, handleCountryChange }) => {
  return (
    <div className="relative">
      <p
        className="text-white text-[1rem] font-bold leading-[100%] tracking-[0.042rem] text-center uppercase courierNew cursor-pointer"
        onClick={handleCountryChange}
      >
        {selectedCurrency} / Eng
      </p>
    </div>
  );
};

export default CurrencySwitcher;
