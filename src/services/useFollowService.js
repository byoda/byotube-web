import { useAxios } from "@/composables";

export const useFollowService = () => {
  const { Api } = useAxios();

  const follow = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/network_links/append`,
      body
    );
  };

  const getFollowedAccounts = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/network_links/query`,
      body
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
  };
};
