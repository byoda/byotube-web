import { useAxios } from "@/composables";

export const useChannelService = () => {
  const { Api } = useAxios();

  const getChannelDataFromCentralAPI = (query) => {
    return Api.get(`/service/channel?${query}`);
  };

  const getShortcutData = (shortcut) => {
    return Api.get(`/service/channel/shortcut?shortcut=${shortcut}`);
  };

  return {
    getChannelDataFromCentralAPI,
    getShortcutData
  };
};
