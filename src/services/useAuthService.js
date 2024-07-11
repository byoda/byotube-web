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

  const getStatus = async () => {
    return Api.get(`status`);;
  };

  const getPodUserData = async (domain) => {
    return Api.post(`https://${domain}/api/v1/data/16384/settings/query`)
  }

  const getLiteUserData = async () => {
    return Api.get(`/lite/settings/member`)
  }
  
  const mutatePodUserData = async (domain, body) => {
    return Api.post(`https://${domain}/api/v1/data/16384/settings/mutate`, body)
  }

  const mutateLiteUserData = async (body) => {
    return Api.patch(`/lite/settings/member`, body)
  }

  const saveImage = async (domain, serviceId, assetId, visibility, files) => {
    return Api.postForm(`https://${domain}/api/v1/pod/member/upload/service_id/${serviceId}/asset_id/${assetId}/visibility/${visibility}`, files, { headers: { 'Content-Type': 'multipart/form-data' } })
  }

  return {
    signIn,
    signUp,
    updateUserDetails,
    uploadUserAvatar,
    updatePassword,
    me,
    createAccountLite,
    verifyEmail,
    getStatus,
    getPodUserData,
    getLiteUserData,
    saveImage,
    mutatePodUserData,
    mutateLiteUserData
  };
};
