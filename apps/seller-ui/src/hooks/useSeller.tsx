"use client";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { isProtected } from "./protected";
import { useAuthStore } from "./authStore";
import { useEffect } from "react";

// fetch Seller data from API
const fetchSeller = async (isLoggedIn: boolean) => {
  const config = isLoggedIn ? isProtected : {};
  const response = await axiosInstance.get("/api/logged-in-seller", config);

  return response.data.seller;
};

const useSeller = () => {
  const { setLoggedIn, isLoggedIn } = useAuthStore();

  const {
    data: seller,
    isLoading,
    isError,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["seller"],
    queryFn: () => fetchSeller(isLoggedIn),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isLoggedIn !== false,
  });

  useEffect(() => {
    if (isError) {
      setLoggedIn(false);
    }
    if (isSuccess) {
      setLoggedIn(true);
    }
  }, [isSuccess, isError]);

  return { seller, isLoading, isError, refetch };
};

export default useSeller;
