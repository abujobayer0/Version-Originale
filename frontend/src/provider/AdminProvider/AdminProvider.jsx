import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { useAuthState } from "react-firebase-hooks/auth";
import app from "../../firebase/firebase.config";
import Loader from "../../components/loader/Loader";
import { useCurrency } from "../../context/CurrencyContext";
const auth = getAuth(app);
const AdminProvider = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const { selectedCurrency, locationLoading } = useCurrency();

  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  const { data: isAdmin, isLoading } = useGetData(`/user?email=${user?.email}`);

  const location = useLocation();
  if (loading || isLoading || locationLoading) {
    return <Loader />;
  }
  if (user && isAdmin?.role === "admin") {
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

export default AdminProvider;
