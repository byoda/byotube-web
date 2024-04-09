import { useAxios } from "@/composables";

export const useAuthService = () => {
  const { Api } = useAxios();

  const signIn = (url, credentials) => {
    return Api.post(url, credentials);
  };
  const createAccountLite = (data) => {
    return Api.post("/lite/account/signup", data);
  };

  const signUp = (data) => {
    return Api.post("auth/register", data);
  };

  const updateUserDetails = (data) => {
    return Api.put("auth/updatedetails", data);
  };

  const uploadUserAvatar = (data) => {
    return Api.put("auth/avatar", data);
  };

  const updatePassword = (data) => {
    return Api.put("auth/updatepassword", data);
  };

  const me = (token) => {
    return Api().post("auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const verifyEmail = async (params) => {
    return Api.get(`lite/account/verify?${params}`);;
  };

  return {
    signIn,
    signUp,
    updateUserDetails,
    uploadUserAvatar,
    updatePassword,
    me,
    createAccountLite,
    verifyEmail,
  };
};
