import { useAxios } from "@/composables";

export const usePaymentService = () => {
  const byopayBaseUrl = import.meta.env.VITE_BYOPAY_API_URL

  const { Api } = useAxios();
  const { Api: byopayApi } = useAxios(byopayBaseUrl, true);

  const setByopayToken = (token) => {
    const byopayToken = localStorage.getItem("byopay-token");
    byopayApi.defaults.headers.Authorization = `Bearer ${
      token || byopayToken
    }`;

  };

  const requestThirdPartyToken = (appId) => {;
    return Api.post(`lite/account/app_token?app_id=${appId}`);
  };

  const requestByopayToken = (token) => {
    return Api.get(
      `${byopayBaseUrl}/pay/auth/external?token=${token}`,
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

  const requestSecretKey = (body) => {
    return byopayApi.post(`/pay/purchase`, body);
  };

  const getReceipt = (paymentId) => {
    return byopayApi.get(`/pay/receipt?payment_id=${paymentId}`);
  };

  const attestBurstPoints = (claimedPoints=1000) => {
    return byopayApi.get(`/pay/burst/attest`);
  };

  const getUserBurstPoints = () => {
    return byopayApi.get(`/pay/burst/balance`);
  };

  return {
    setByopayToken,
    requestThirdPartyToken,
    requestByopayToken,
    requestSecretKey,
    getReceipt,
    attestBurstPoints,
    getUserBurstPoints
  };
};
