import { useAuthStore } from "@/store";
import axios from "axios";
import { useRouter } from "vue-router";

export const useAxios = (baseURL, tokenKey = "token") => {
  const router = useRouter();
  const authStore = useAuthStore();

  const axiosInstance = axios.create({
    baseURL: `${baseURL || `${import.meta.env.VITE_APP_URL}/api/v1/`}`,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(tokenKey);
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        authStore.setAuth(false);
      }
      return Promise.reject(error);
    }
  );

  return {
    Api: axiosInstance,
  };
};
