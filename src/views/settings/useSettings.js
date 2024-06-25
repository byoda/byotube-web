import { constants } from "@/globals/constants";
import { useAuthService } from "@/services";
import { ref } from "vue";
import { uuid } from "vue-uuid";

export const useSettings = () => {
  const { getPodUserData, mutatePodUserData, saveImage } = useAuthService();

  const file = ref();
  const user = JSON.parse(localStorage.getItem("user"));
  const userInfo = ref(
    user || {
      nick: null,
      avatar: null,
    }
  );
  const domain = localStorage.getItem("domain");

  const uploaImage = async () => {
    try {
      const formData = new FormData();
      formData.append("files", file.value);
      const serviceId = constants.BYOTUBE_SERVICE_ID;
      const assetId = uuid.v4();
      const visibility = "public";
      const { data } = await saveImage(
        domain,
        serviceId,
        assetId,
        visibility,
        formData
      );
    } catch (error) {}
  };

  const updateUserData = async () => {
    try {
      const body = {
        query_id: uuid.v4(),
        data: {
          nick: userInfo.value?.nickname,
        },
      };
      const { data } = await mutatePodUserData(domain, body);
    } catch (error) {}
  };

  return {
    userInfo,
    file,
    user,
    uploaImage,
    updateUserData,
  };
};
