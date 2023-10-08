
function Pagination({ pageNumbers, currentPage, onPageChange }) {


    const handlePageNumberClick = (page) => {
        onPageChange(page);
      };
  return (
    <div className="w-full flex mt-[55px] justify-center items-center gap-2 ">
  
      {pageNumbers?.map((page) => (
        <button
          key={page}
          onClick={() => handlePageNumberClick(page)}
          className={`${currentPage === page ? 'border text-white py-[28px]   bg-[#38453E] ' : 'border-2 py-[26px]   bg-transparent border-[#BCC0BB] text-[#0000006B] ' } px-[24px] w-[62px] h-[42px]  flex justify-center items-center`}
        >
          {page}
        </button>
      ))}
  
  </div>
  );
}

export default Pagination;
