"use client";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "../store/authStore";
import { isProtected } from "../utils/protected";
import { useEffect } from "react";

// fetch user data from API
const fetchUser = async (isLoggedIn: boolean) => {
  const config = isLoggedIn ? isProtected : {};
  const response = await axiosInstance.get("/api/logged-in-user", config);

  return response.data.user;
};

const useUser = () => {
  const { setLoggedIn, isLoggedIn } = useAuthStore();

  const {
    data: user,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(isLoggedIn),
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

  return { user: user as any, isLoading, isError };
};

export default useUser;
