import { useAxios } from "@/composables";

export const usePaymentService = () => {
  const { Api } = useAxios();

  const requestThirdPartyToken = (appId) => {
    return Api.post(`lite/account/app_token?app_id=${appId}`);
  };

  const requestByopayToken = (token) => {
    return Api.get(
      `https://staging.byopay.me/api/v1/pay/auth/external?token=${token}`,
      {
        headers: {
          "Content-Type": "application/json",
          common: {
            Authorization: ``,
          },
        },
      }
    );
  };

  return {
    requestThirdPartyToken,
    requestByopayToken
  };
};
