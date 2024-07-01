import { useAxios } from "@/composables";

export const useAssetReactionService = () => {
  const { Api } = useAxios();

  const addEditReactionLite = (body) => {
    return Api.post(`/lite/assetreaction`, body);
  };

  const getAssetReactionsLite = (query) => {
    return Api.get(`/lite/assetreaction?${query}`);
  };

  const getAllAssetReactionsLite = (query) => {
    return Api.get(`/lite/assetreactions?${query}`);
  };

  const appendMessage = async (domain, serviceId, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/messages/append`,
      body 
    );
  };

  const appendBtLiteMessage = async ( body) => {
    return Api.post(
      `/lite/proxy/append`,
        body 
    );
  };
  const getMessages = async (domain, serviceId, body) => {
    return Api.post(
      `https://${domain}/api/v1/data/${serviceId}/messages/query`,
      body 
    );
  };

  const getBtLiteMessages = async (body) => {
    return Api.post(
      `lite/proxy/query`,
      body 
    );
  };

  return {
    addEditReactionLite,
    getAssetReactionsLite,
    getAllAssetReactionsLite,
    appendMessage,
    getMessages,
    appendBtLiteMessage,
    getBtLiteMessages
  };
};
