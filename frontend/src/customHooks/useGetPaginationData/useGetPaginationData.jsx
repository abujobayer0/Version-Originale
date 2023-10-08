
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance/axiosInstance";

export const useGetPaginationData = (url, page = 1) => {
  const query = useQuery({
    queryKey: [url, page],
    queryFn: () =>
      axiosInstance.get(`${url}?page=${page}`).then((response) => response.data),
  });

  return query;
};
