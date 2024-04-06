import { useFollowService } from "@/services";
import { ref } from "vue";

export const useFollow = () => {
  const { follow, informPodAboutFollow, getFollowedAccounts, followBtLite } =
    useFollowService();

  const followedAccounts = ref(null);

  const initialState = {
    auth_token:
      typeof window !== "undefined" ? localStorage.getItem("token") : null,
    domain:
      typeof window !== "undefined" ? localStorage.getItem("domain") : null,
    isAuthenticated: null,
    user: null,
  };

  const service_id = import.meta.env.VITE_BYOTUBE_SERVICE_ID;

  //Follow
  const followAccount = (channelName, origin, createdTimestamp) => {
    const body = {
      relation: "follow",
      annotations: [channelName],
      member_id: origin,
      created_timestamp: createdTimestamp,
    };
    return follow(
      { domain: initialState.domain, serviceId: service_id },
      { data: body }
    );
  };

  const followWithBtLiteAccount = (channelName, origin, createdTimestamp) => {
    const body = {
      relation: "follow",
      annotations: [channelName],
      member_id: origin,
      created_timestamp: createdTimestamp,
    };
    return followBtLite(body);
  };

  const informPodAboutAccountFollow = ({
    remote_member_id,
    depth,
    query_id,
  }) => {
    return informPodAboutFollow(
      { domain: initialState.domain, serviceId: service_id },
      { remote_member_id, depth, query_id }
    );
  };

  const setFollowed = (memberId) => {
    let alreadyFollowed = JSON.parse(localStorage.getItem("followedAccounts"));
    if (alreadyFollowed?.length) {
      if (alreadyFollowed?.includes(memberId)) {
        alreadyFollowed = alreadyFollowed.filter(
          (member) => member !== memberId
        );
      } else {
        alreadyFollowed.push(memberId);
      }
      localStorage.setItem("followedAccounts", JSON.stringify(alreadyFollowed));
    } else {
      const followedAccounts = [memberId];
      localStorage.setItem(
        "followedAccounts",
        JSON.stringify(followedAccounts)
      );
    }
  };

  const followChannel = async (asset, origin) => {
    const { creator, created_timestamp } = asset;
    const { data } = await follow(
      creator,
      origin,
      service_id,
      created_timestamp
    );
    if (data) {
      setFollowed(origin);
    }
    followedAccounts.value = JSON.parse(
      window.localStorage.getItem("followedAccounts")
    );
  };

  const getFollowedChannels = async (serviceId) => {
    try{
      const followedChannels =  await getFollowedAccounts(
        {
          domain: initialState.domain,
          serviceId: serviceId ? serviceId : service_id,
        },
        {}
      );
      const getFollowedIds = followedChannels?.data?.edges?.map(channel => {
        return channel?.node?.member_id
      })
  
      localStorage.setItem('followedAccounts', JSON.stringify(getFollowedIds))
  
      return followedChannels
    }catch(error){
      console.error("Error", error);
    }
  };

  return {
    followedAccounts,
    followAccount,
    informPodAboutAccountFollow,
    setFollowed,
    followChannel,
    getFollowedChannels,
    followWithBtLiteAccount
  };
};
