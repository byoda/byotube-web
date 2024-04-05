import { useAxios } from "@/composables";

export const useAssetReactionService = () => {
  const { Api } = useAxios();

  const addEditReactionLite = (body) => {
    return Api.post(
      `/lite/assetreaction`,
      body
    );
  };

  const getAssetReactionsLite = (query) => {
    return Api.get(
      `/lite/assetreaction?${query}`,
    );
  };


  return {
    addEditReactionLite,
    getAssetReactionsLite
  };
};
