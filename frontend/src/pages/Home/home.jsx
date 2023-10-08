import { Suspense, lazy, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const HomeSlider = lazy(() => import("../../components/slider/homeSlider"));
const HomeBanner = lazy(() => import("../../components/banner/homeBanner"));
const MostWanted = lazy(() =>
  import("../../components/bestSelling/bestSelling")
);
const LookBook = lazy(() => import("../../components/lookBook/lookBook"));
const RockyProcduct = lazy(() =>
  import("../../components/rockyProduct/rockyProduct")
);
const Stories = lazy(() => import("../../components/stories/stories"));
const NewDropComp = lazy(() => import("../../components/newDrop/newDrop"));
import { useCurrency } from "../../context/CurrencyContext";
import InitializeGoogleAnalytics from "../../analytics/googleAnalytics/googleAnalytics";

const Home = () => {
  const navigate = useNavigate();
  const { selectedCurrency, locationLoading } = useCurrency();

  useEffect(() => {
    const setRoute = async () => {
      if (!locationLoading) {
        const countryRoute = (await selectedCurrency) === "BDT" ? "bd" : "uae";
        navigate(`/${countryRoute}`);
      }
    };

    <InitializeGoogleAnalytics />;
    setRoute();
  }, [selectedCurrency, locationLoading, navigate]);
  return (
    <>
      <Suspense
        fallback={
          <>
            <p className="w-full h-screen flex justify-center text-[#839F90] items-center">
              Loading...
            </p>
          </>
        }
      >
        <HomeSlider />
        <NewDropComp />
        <MostWanted />
        <HomeBanner />
        <LookBook />
        <RockyProcduct />
        <Stories />
      </Suspense>
    </>
  );
};

export default Home;
