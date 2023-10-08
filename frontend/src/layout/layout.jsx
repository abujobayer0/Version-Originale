import { Outlet } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import DiscountPopup from "../components/DiscountPopup/Discount";
const MainLayout = () => {
  return (
    <>
      <Header></Header>
      <DiscountPopup />
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default MainLayout;
