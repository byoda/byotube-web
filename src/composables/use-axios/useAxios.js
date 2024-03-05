import { useAuthStore } from "@/store";
import axios from "axios";
import { useRouter } from "vue-router";

export const useAxios = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_URL}/api/v1/`,
  });

  const token = localStorage.getItem("token");
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        authStore.setAuth(false);
        router.push({ name: "SignIn" });
      }
      return Promise.reject(error);
    }
  );

  return {
    Api: axiosInstance,
  };
};
