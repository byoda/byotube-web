import { useAxios } from "@/composables";

export const useChannelService = () => {
  const { Api } = useAxios();

  const getChannelDataFromCentralAPI = (query) => {
    return Api.get(`/service/channel?${query}`);
  };

  const getShortcutData = (shortcut) => {
    return Api.get(`/service/channel/shortcut?shortcut=${shortcut}`);
  };

  const getShortcutByValue = (memberId, creator) => {
    return Api.get(`/service/channel/shortcut_by_value?member_id=${memberId}&creator=${creator}`);
  };

  return {
    getChannelDataFromCentralAPI,
    getShortcutData,
    getShortcutByValue
  };
};
