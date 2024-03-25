import { useAxios, useHelper } from "@/composables";

export const useVideoService = () => {
  const { Api } = useAxios();
  const { channelQuery } = useHelper()


  const getAll = (filter) => {
    const query = channelQuery(filter);

    return Api.get(`service/data?${query}`);
  };

  const getMemberVideos = (url, body = {}) => {
    return Api.post(url, body);
  };

  const appendReaction = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/append`,
      body
    );
  };
  const updateReaction = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/update`,
      body
    );
  };

  const editLikedVideo = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/update`,
      body
    );
  };

  const deleteAssetReaction = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/delete`,
      body
    );
  };

  const requestPodAboutLike = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions_received/append`,
      body
    );
  };

  const getAssetReactions = ({ domain, serviceId }, filter) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/query`,
      filter
    );
  };

  const searchAssets = (filter) => {
    return Api.get(
      `service/search/asset?text=${filter.text}&num=${filter.num}&offset=${filter.offset}`
    );
  };

  const getChannel = ({ domain, serviceId }, filter) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/channels/query`,
      filter
    );
  };

  const queryPodForVideo = ({ domain, serviceId }, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/public_assets/query`,
      body
    );
  };

  const getAssetFromCentralData = (query) => {
    return Api.get(`/service/asset?${query}`);
  };

  return {
    getAll,
    getAssetReactions,
    getChannel,
    searchAssets,
    editLikedVideo,
    appendReaction,
    updateReaction,
    getMemberVideos,
    deleteAssetReaction,
    queryPodForVideo,
    requestPodAboutLike,
    getAssetFromCentralData,
  };
};
