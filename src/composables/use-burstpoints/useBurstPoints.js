import { constants } from "@/globals/constants";
import { usePaymentService } from "@/services";

export const useBurstPoints = () => {
  const {
    getUserBurstPoints,
    requestThirdPartyToken,
    requestByopayToken,
    setByopayToken,
    attestBurstPoints,
  } = usePaymentService();

  const singleCallforByopayToken = async () => {
    try {
      const appId = 'f7d6d367-3d1a-4424-8ba5-139e8f3a51c3';
      const domain = localStorage.getItem('domain')
      const body = {
        service_id: constants.BYOTUBE_SERVICE_ID,
        target_id: appId,
        target_type: 'apps-'
      }
      const { data } = await requestThirdPartyToken(appId, domain, body);
      const { data: byopayData } = await requestByopayToken(data?.auth_token);
      setByopayToken(byopayData?.auth_token);
      localStorage.setItem("byopay-token", byopayData?.auth_token);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const checkUserBurstPoints = async () => {
    try {
      await singleCallforByopayToken();
      const { data } = await getUserBurstPoints(); 
      return data
    } catch (error) {
      console.error("Error", error);
    }
  };

  const attestUserBurstPoints = async () => {
    try {
      await singleCallforByopayToken();
      const { data } = await attestBurstPoints();
      localStorage.setItem("attestation", JSON.stringify(data));
    } catch (error) {
      console.error("Error", error);
    }
  };

  return {
    checkUserBurstPoints,
    attestUserBurstPoints,
    singleCallforByopayToken
  };
};
