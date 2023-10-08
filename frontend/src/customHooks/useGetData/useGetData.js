import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance/axiosInstance";


export const useGetData = (url) => {
  const query = useQuery({
    queryKey: [url],
    queryFn: () => axiosInstance.get(url).then((response) => response.data),
  });

  return query;
};