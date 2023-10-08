import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import Loader from "../../components/loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";
const auth = getAuth(app);
const PrivateProvider = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const { data: isUser, isLoading } = useGetData(`/user?email=${user?.email}`);
  const { selectedCurrency } = useCurrency();

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";

  const location = useLocation();
  if (loading || isLoading) {
    return <Loader />;
  }
  if (user && isUser.role === "customer") {
    return children;
  }

  return (
    <Navigate
      to={`/${countryRoute}/login`}
      state={{ from: location }}
      replace
    ></Navigate>
  );
};

export default PrivateProvider;
