import { useAxios } from "@/composables";

export const usePaymentService = () => {
  const { Api } = useAxios();
  const { Api:byopayApi } = useAxios();

  const setByopayToken = (token) => {
    const byopayToken = localStorage.getItem('byopay-token')
    byopayApi.defaults.headers.common.Authorization = `Bearer ${token || byopayToken}`
  }
  
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

  const requestSecretKey = (body) => {
    return byopayApi.post(`https://staging.byopay.me/api/v1/pay/purchase`, body)
  }

  const getReceipt = (paymentId) => {
    return byopayApi.get(`https://staging.byopay.me/api/v1/pay/receipt?payment_id=${paymentId}`)
  }

  return {
    setByopayToken,
    requestThirdPartyToken,
    requestByopayToken,
    requestSecretKey,
    getReceipt
  };
};
