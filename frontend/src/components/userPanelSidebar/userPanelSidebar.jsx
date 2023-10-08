import { BiLogOut } from "react-icons/bi";
import { AuthContext } from "../../context/contextAPI";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const UserPanelSidebar = ({ status, handleSearchStatus }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const from = useLocation();

  const logoutHandler = () => {
    logOut()
      .then(() => {
        toast.success("Signed Out Successfully");
        navigate(from || "/");
      })
      .catch((error) => {});
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center gap-4 items-center">
        <div className="flex items-center justify-between cursor-pointer w-[350px] h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#f3f3f3] ">
          <input
            type="text"
            onChange={(e) => handleSearchStatus(e.target.value)}
            className="text-white text-opacity-[0.76] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] w-full bg-transparent courierNew outline-none"
            placeholder="Order Id to Status Check"
          />
        </div>
        {status && (
          <div className="flex items-center justify-between cursor-pointer w-[350px] h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 bg-[#2c332e] border-[#f3f3f3] my-[1.38rem]">
            <button className="text-white text-opacity-[0.76] flex justify-center items-center text-center gap-4 text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] w-full bg-transparent courierNew outline-none">
              {status || "status checker"}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between cursor-pointer w-[350px] h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#fff]/20 my-[1.38rem]">
          <button
            onClick={logoutHandler}
            className="text-white  text-opacity-[0.76] flex justify-center items-center text-center gap-4 text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] w-full bg-transparent courierNew outline-none"
          >
            <BiLogOut />
            Log out
          </button>
        </div>
      </div>
    </>
  );
};

export default UserPanelSidebar;
