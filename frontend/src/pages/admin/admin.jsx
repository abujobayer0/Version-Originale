import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin_sidebar/adminSidebar";
import logo from "../../assets/img/logo.webp";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/contextAPI";
import { BiLogOut } from "react-icons/bi";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { HiMenu } from "react-icons/hi";
const AdminPanel = () => {
  const { logOut } = useContext(AuthContext);

  const handleSignout = () => {
    logOut();
  };
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="w-full flex justify-between items-center px-6 bg-[#839f9099]">
        <img src={logo} alt="logo" className="py-4" loading="lazy" />{" "}
        <button
          onClick={handleSignout}
          className="px-4 py-2 rounded ml-2 text-lg bg-gray-100 text-[#839f9099]"
        >
          <BiLogOut />
        </button>
      </div>
      <div className="w-full flex xl:hidden py-2 bg-gray-50 px-6">
        <button
          onClick={toggleDrawer}
          className="text-3xl p-2 bg-gray-100 text-[#a1a9a5]"
        >
          <HiMenu />
        </button>
      </div>
      <div className="xl:py-8 bg-white w-full xl:gap-8 items-center lg:items-start justify-between flex-col lg:flex-row flex">
        <div className="w-full hidden lg:w-[400px] relative lg:min-h-screen xl:flex justify-end items-start ">
          <AdminSidebar />
        </div>
        <div className="block xl:hidden">
          <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction="left"
            className="bla bla bla"
          >
            <AdminSidebar />
          </Drawer>
        </div>

        <div className="relative scrollable-container w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
