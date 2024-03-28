import { useAxios } from "@/composables";

export const useChannelService = () => {
  const { Api } = useAxios();

  const getChannelDataFromCentralAPI = (query) => {
    return Api.get(`/service/channel?${query}`);
  };
  return {
    getChannelDataFromCentralAPI,
  };
};
