import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../../components/product/product";
import Loader from "../../components/loader/Loader";

const CategoryDetail = () => {
  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://test-originale.onrender.com/category/products?query=${query}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        setIsLoading(false);
      });
  }, [query]);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className=" px-6 lg:px-[6rem] xl:px-[12rem] pt-[2.13rem] pb-[3rem] lg:pt-[5.19rem] lg:pb-[4.35rem]">
      <div className="flex items-center justify-between mb-[2.3rem]">
        <h2 className="text-[#2c332e] text-base xl:text-[1.25rem] font-bold leading-[122.5%] tracking-[0.012rem] uppercase euroWide mx-auto text-center">
          {query} products
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-[12px] md:gap-[20px]">
        {products.map((curElem) => {
          return <Product key={curElem.id} {...curElem} />;
        })}
      </div>
    </div>
  );
};

export default CategoryDetail;
