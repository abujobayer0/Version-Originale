import { useContext } from "react";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";
import AuthContext from "../../context/contextAPI";
import { useQuery } from "@tanstack/react-query";

function useAdmin() {
    const [axiosSecure] = useAxiosSecure();
    const { user, loading } = useContext(AuthContext);
    const {
        data: isAdmin = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["isAdmin"],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/${user?.email}`);
            return res.data.admin;
        },
    });
    return [isAdmin, refetch, isLoading];
}
export default useAdmin;
