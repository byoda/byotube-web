import { useAxios } from "@/composables";

export const useAuthService = () => {
  const { Api } = useAxios();

  const signIn = (url, credentials) => {
    return Api.post(url, credentials);
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

  return {
    signIn,
    signUp,
    updateUserDetails,
    uploadUserAvatar,
    updatePassword,
    me,
  };
};
