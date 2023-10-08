import gallery1 from "../../assets/img/look-book/gallery-1.webp";
import gallery2 from "../../assets/img/look-book/gallery-2.webp";
import gallery3 from "../../assets/img/look-book/gallery-3.webp";
import gallery4 from "../../assets/img/look-book/gallery-4.webp";
import gallery5 from "../../assets/img/look-book/gallery-5.webp";
import gallery6 from "../../assets/img/look-book/gallery-6.webp";
import gallery7 from "../../assets/img/look-book/gallery-7.webp";
import gallery8 from "../../assets/img/look-book/gallery-8.webp";
import ReactPlayer from "react-player";

const lookBook = () => {
  return (
    <section>
      <div className=" px-6 xl:px-[7rem] py-[3.31rem]">
        <h2 className="text-[#fff] text-center text-[1.25rem] font-bold leading-[122.5%] tracking-[0.013rem] uppercase mb-[2.44rem] euroWide">
          Color Contrast Look Book
        </h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery1} alt="" loading="lazy" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 xl:row-span-2">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=HfPt-HpuxLw"
              controls={false}
              playing={true}
              muted={true}
              width="100%"
              height="100%"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery2} alt="" loading="lazy" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery3} alt="" loading="lazy" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery4} alt="" loading="lazy" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery5} alt="" loading="lazy" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery6} alt="" loading="lazy" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery7} alt="" loading="lazy" />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3">
            <img src={gallery8} alt="" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default lookBook;
