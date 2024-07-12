import { useAxios } from "@/composables";

export const usePaymentService = () => {
  const byopayBaseUrl = import.meta.env.VITE_BYOPAY_API_URL

  const { Api } = useAxios();
  const { Api: byopayApi } = useAxios(byopayBaseUrl, 'byopay-token');

  const setByopayToken = (token) => {
    const byopayToken = localStorage.getItem("byopay-token");
    byopayApi.defaults.headers.Authorization = `Bearer ${
      token || byopayToken
    }`;

  };

  const requestThirdPartyToken = (appId, domain, body) => {;
    return  domain != 'null' && domain != null ? Api.post(`https://${domain}/api/v1/pod/authtoken/remote`, body) : Api.post(`lite/account/app_token?app_id=${appId}`);
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
    const refferer = localStorage.getItem('burst_referrer')
    if(refferer){
      body.referrer = refferer
    }
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

  const getTransactions = (query = null) => {
    return byopayApi.get(`/pay/burst/transactions`);
  };

  const registerInStripe = (body) => {
    return byopayApi.post(`/pay/account`, body);
  };

  const payout = (query) => {
    return byopayApi.get(`/pay/payout?${query}`);
  };

  const getAccount = () => {
    return byopayApi.get(`/pay/account`);
  };
  
  const getPayoutDetails = (query) => {
    return byopayApi.get(`/pay/payout_history?payout_id=${query}`);
  };

  const getPurchaseDetails = (query) => {
    return byopayApi.get(`/pay/purchase?payment_id=${query}`);
  };

  return {
    setByopayToken,
    requestThirdPartyToken,
    requestByopayToken,
    requestSecretKey,
    getReceipt,
    attestBurstPoints,
    getUserBurstPoints,
    getTransactions,
    registerInStripe,
    payout,
    getAccount,
    getPayoutDetails,
    getPurchaseDetails

  };
};
