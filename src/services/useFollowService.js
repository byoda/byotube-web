import { useAxios } from "@/composables";

export const useFollowService = () => {
  const { Api } = useAxios();

  const follow = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/network_links/append`,
      body
    );
  };

  const followBtLite = ( body) => {
    return Api.post(`/lite/networklink`, body);
  };

  const getFollowedAccounts = ({ domain, serviceId }, body) => {
    const requestUrl =  !!JSON.parse(domain) ? `https://${domain}/api/v1/data/${serviceId}/network_links/query` : 'https://api.byo.tube/api/v1/lite/networklinks';
    return Api.get(
      requestUrl
    );
  };
  
  const informPodAboutFollow = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/network_links_inbound/query`,
      body
    );
  };

  return {
    follow,
    getFollowedAccounts,
    informPodAboutFollow,
    followBtLite
  };
};
