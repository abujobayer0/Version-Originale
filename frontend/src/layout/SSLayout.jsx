import Footer from "../footer/footer";
import Header from "../header/header";

const SSLayout = ({ children }) => {
  return (
    <>
      <Header></Header>
      {children}
      <Footer></Footer>
    </>
  );
};

export default SSLayout;
