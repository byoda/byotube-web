import axios from "axios";

export default () => {
  const axiosInstance = axios.create({
    baseURL: `${import.meta.VUE_APP_URL}/api/v1/`,
  });

  const token = localStorage.getItem("token");
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error == 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // location.reload()
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
