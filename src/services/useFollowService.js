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

  const unfollowBtLite = (query) => {
    return Api.delete(`/lite/networklink?${query}`);
  };

  const getFollowedAccounts = ({ domain, serviceId }, body) => {
    return  domain != 'null' ? Api.post(`https://${domain}/api/v1/data/${serviceId}/network_links/query`, body) : Api.get('https://api.byo.tube/api/v1/lite/networklinks');
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
    followBtLite,
    unfollowBtLite,
  };
};
