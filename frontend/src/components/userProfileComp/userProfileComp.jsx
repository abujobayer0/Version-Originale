import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from "react-toastify"; // You can use toast for displaying messages
import app from "../../firebase/firebase.config";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../loader/Loader";
import axios from "axios";
const auth = getAuth(app);
const UserProfileComp = () => {
  const [user] = useAuthState(auth);
  const { data, isLoading } = useGetData(`/user?email=${user?.email}`);
  const PB = !isLoading && data;
  const FN = !isLoading && PB?.firstName;
  const LN = !isLoading && PB?.lastName;
  const [firstName, setFirstName] = useState(FN || "");
  const [lastName, setLastName] = useState(LN || "");

  const [resetPasswordClicked, setResetPasswordClicked] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.post(
        "https://test-originale.onrender.com/update-user-name",
        {
          email: user?.email,
          firstName: firstName,
          lastName: lastName,
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the profile");
    }
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, user?.email)
      .then(() => {
        setResetPasswordClicked(true);
        toast.info("Password reset email sent");
      })
      .catch((error) => {});
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="mx-auto p-4 max-w-xl">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-white mb-4">User Profile</h2>
      <div className="mb-4">
        <label className="block text-white">First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
      <button
        onClick={handleUpdateProfile}
        className="bg-[#1c1e22] text-white px-4 py-2 rounded "
      >
        Update Profile
      </button>

      {resetPasswordClicked ? (
        <p className="mt-4 text-green-600">
          Password reset email has been sent to your email address.
        </p>
      ) : (
        <button
          onClick={handleForgotPassword}
          className="mt-4 bg-gray-800 ml-4 text-white px-4 py-2 rounded hover:bg-gray-400"
        >
          Forgot Password
        </button>
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4">User Data</h2>
      <div className="mb-4">
        <label className="block text-white">Name:</label>
        <span className="text-white font-semibold">
          {`${data.firstName + " " + data.lastName || data.name} `}
        </span>
      </div>
      <div className="mb-4">
        <label className="block text-white">Email:</label>
        <span className="text-white font-semibold">{user.email}</span>
      </div>

      <div className="mb-4">
        <label className="block text-white">Joining Date:</label>
        <span className="text-white font-semibold">
          {new Date(data.joinedDate).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default UserProfileComp;
