import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/contextAPI";

export const axiosSecure = axios.create({
  baseURL: "https://test-originale.onrender.com/",
});
function useAxiosSecure() {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosSecure.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          // await logOut()
          // navigate('/login')
        }
        return Promise.reject(err);
      }
    );
  }, [logOut, navigate]);

  return [axiosSecure];
}

export default useAxiosSecure;
