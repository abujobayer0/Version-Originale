import { AuthContext } from "../../context/contextAPI";
import { Link, useNavigate } from "react-router-dom";
import { AiFillGoogleCircle } from "react-icons/ai";
import { HiOutlineChevronDown } from "react-icons/hi";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import app from "../../firebase/firebase.config";
const auth = getAuth(app);
const Login = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckStay, setIsCheckStay] = useState(false);
  const googleProvider = new GoogleAuthProvider();
  const from = location?.state?.from?.pathname || "/";
  const { signinUser, signInPopup } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  function registerHander(event) {
    event.preventDefault();
    const gender = event.target.gender.value;
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const email = event.target.registerEmail.value;
    const password = event.target.registerPassword.value;
    const confirmPassword = event.target.registerConfirmPassword.value;
    const country = event.target.country.value;

    if (password !== confirmPassword) {
      return;
    }

    createUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user && user?.email) {
          axios
            .post(`https://test-originale.onrender.com/user/${user?.email}`, {
              firstName,
              lastName,
              email,
              password,
              role: "customer",
              subscribe: isCheck,
              country,
              joinedDate: new Date(),
            })
            .then((data) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "SIGN UP SUCCESSFUL",
                showConfirmButton: false,
                timer: 1500,
              });
              navigate(from, { replace: true });
            });
        }

        event.target.reset();

        // logOut().then(() => {
        // }).catch((error) => {
        // });
        // navigate('/')
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${errorMessage}`,
        });
      });
  }

  function signinHander(event) {
    event.preventDefault();

    // Perform Firebase sign-in
    signinUser(loginEmail, loginPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        // Fetch user data from your server
        fetch(`https://test-originale.onrender.com/user?email=${user.email}`)
          .then((res) => res.json())
          .then((userData) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "SIGN IN SUCCESSFUL",
              showConfirmButton: false,
              timer: 1500,
            });

            navigate(from);
          })
          .catch((error) => {
            const errorMessage = error.message;
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `${errorMessage}`,
            });
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${errorMessage}`,
        });
      });
  }

  function checkboxHandler(event) {
    setIsCheck(event.target.checked);
  }

  function signInCheckboxHandler(event) {
    setIsCheckStay(event.target.checked);
  }
  const handleForgotPassword = () => {
    if (loginEmail === "") {
      return alert("invaid email");
    }
    sendPasswordResetEmail(auth, loginEmail)
      .then(() => {
        toast.info("Password reset email sent");
      })
      .catch((error) => {});
  };
  async function googleHandler() {
    try {
      const result = await signInPopup(googleProvider);
      const user = result.user;

      if (user && user?.email) {
        const data = await axios.post(
          `https://test-originale.onrender.com/user/${user?.email}`,
          {
            name: user?.displayName,
            email: user?.email,
            role: "customer",
            subscribe: isCheck,
            joinedDate: new Date(),
            image: user?.photoURL,
          }
        );

        if (data) {
          const userData = await fetch(
            `https://test-originale.onrender.com/user?email=${user?.email}`
          );

          if (userData.role === "admin") {
            navigate("/admin");
            Swal.fire({
              position: "center",
              icon: "success",
              title: "SIGN IN SUCCESSFUL",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            navigate(from);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "SIGN IN SUCCESSFUL",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      }
    } catch (error) {
      const errorMessage = error.message;
      console.error(errorMessage);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${errorMessage}`,
      });
    }
  }
  const handleForgetPass = () => {
    handleForgotPassword();
  };
  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, []);

  return (
    <section className="">
      <ToastContainer />
      <div className=" pt-[3rem] pb-[4.5rem] xl:pt-[5rem] xl:pl-[8rem] xl:pr-[12rem] xl:pb-[8rem]">
        <div className="flex flex-col xl:flex-row justify-center items-start gap-8 xl:gap-12">
          <div className="signin w-full xl:w-[32rem]">
            <h2 className="text-[#f3f3f3] text-[1rem] font-bold leading-[122.5%] tracking-[#0.012rem] uppercase euroWide">
              Sign in to your account
            </h2>
            {/* Sing in */}
            <form
              onSubmit={signinHander}
              className="flex flex-col mt-[1.44rem]"
            >
              <input
                type="email"
                name="loginEmail"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="flex items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none"
              />
              <input
                name="loginPassword"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="flex items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew mt-[0.88rem] outline-none"
              />
              <div className="flex  items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] mt-[1.38rem]">
                <input
                  type="checkbox"
                  id="checkbox-newsletter"
                  onClick={signInCheckboxHandler}
                />
                <span className="text-[#9CA3AF]  text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none">
                  Stay Sign in
                </span>
              </div>
              <button
                type="submit"
                className="mt-[1.75rem] bg-[#38453e] border border-[#9CA3AF] flex items-center justify-center w-full h-[4rem] p-[0.63rem] gap-[0.63rem] text-white text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] uppercase courierNew"
                onClick={signinHander}
              >
                Sign In
              </button>
              <button
                type="button"
                className="mt-[0.88rem] bg-[#CED4CD] flex items-center justify-center w-full h-[4rem] p-[0.63rem] gap-[0.63rem] text-[#38453E] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] uppercase courierNew"
                onClick={googleHandler}
              >
                <AiFillGoogleCircle />
                Sign In with Google
              </button>
              <button
                type="button"
                onClick={handleForgetPass}
                className="mt-[0.88rem] bg-[#CED4CD] flex items-center justify-center w-full h-[4rem] p-[0.63rem] gap-[0.63rem] text-[#38453E] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] uppercase courierNew"
              >
                I forgot my password 💀
              </button>
            </form>
          </div>
          <hr className="h-[0.11rem] border-t-0 bg-white opacity-[0.21] block xl:hidden" />
          <div className="register w-full xl:w-[32rem]">
            <h2 className="text-[#f3f3f3] text-[1rem] font-bold leading-[122.5%] tracking-[#0.012rem] uppercase euroWide">
              register a new account
            </h2>
            {/* Registration */}
            <form
              onSubmit={registerHander}
              className="flex flex-col mt-[1.44rem]"
            >
              <div className="relative">
                <select
                  name="gender"
                  className="flex  justify-between items-center w-full h-[4rem]  text-[#9CA3AF]  px-[1.5rem] text-[0.95rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew gap-[0.63rem] border-2 border-[#9CA3AF] appearance-none outline-none "
                >
                  <option value="" selected disabled>
                    Gender (Optional)
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <span className="absolute inset-y-0 right-8 flex items-center pointer-events-none text-white text-opacity-[0.42]">
                  <HiOutlineChevronDown size={30} />
                </span>
              </div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                className="flex  items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                className="flex items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]"
              />
              <input
                type="email"
                name="registerEmail"
                required
                placeholder="Email Address"
                className="flex items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem]"
              />
              <input
                type="password"
                name="registerPassword"
                required
                placeholder="Password"
                className="flex items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] appearance-none"
              />
              <input
                type="password"
                name="registerConfirmPassword"
                placeholder="Confirm Password"
                required
                className="flex items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] text-white text-opacity-[0.42] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none mt-[0.88rem] appearance-none"
              />
              <div className="relative mt-[0.88rem]">
                <select
                  name="country"
                  className="flex justify-between items-center w-full h-[4rem] text-[#9CA3AF]  px-[1.5rem] text-[0.95rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew gap-[0.63rem] border-2 border-[#9CA3AF] appearance-none outline-none "
                >
                  <option value="bangladesh" selected>
                    Bangladesh
                  </option>
                  <option value="UAE">United Arab Emirates</option>
                </select>
                <span className="absolute inset-y-0 right-8 flex items-center pointer-events-none text-white text-opacity-[0.42]">
                  <HiOutlineChevronDown size={30} />
                </span>
              </div>
              <div className="flex items-center w-full h-[4rem] py-[1.75rem] pl-[1.5rem] pr-[2rem] gap-[0.63rem] border-2 border-[#9CA3AF] mt-[1.38rem]">
                <input
                  type="checkbox"
                  id="checkbox-newsletter"
                  onClick={checkboxHandler}
                />
                <span className="text-[#9CA3AF]  text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] bg-transparent courierNew outline-none">
                  Subscribe to Newsletter
                </span>
              </div>
              <p className="flex items-center w-full mt-[2.19rem] text-[#9CA3AF]  text-[.94rem] font-bold leading-[119.5%] tracking-[0.0094rem] courierNew">
                Your personal data will be used for the creation of your account
                and to provide you with all the related services. For any
                further information, please read the Privacy Policy.
              </p>
              <button
                type="submit"
                className="mt-[1.75rem] bg-[#38453e] flex items-center justify-center w-full h-[4rem] p-[0.63rem] gap-[0.63rem] text-white text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] uppercase courierNew border border-[#9CA3AF]"
                onSubmit={registerHander}
              >
                Create Account
              </button>
              <Link
                to="#"
                className="mt-[0.88rem] bg-[#CED4CD] flex items-center justify-center w-full h-[4rem] p-[0.63rem] gap-[0.63rem] text-[#38453E] text-[0.94rem] font-bold leading-[77.5%] tracking-[0.009rem] uppercase courierNew"
                onClick={googleHandler}
              >
                <AiFillGoogleCircle />
                Register with Google
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
