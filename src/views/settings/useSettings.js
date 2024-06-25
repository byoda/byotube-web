import { constants } from "@/globals/constants";
import { useAuthService } from "@/services";
import { ref } from "vue";
import { uuid } from "vue-uuid";

export const useSettings = () => {

  const { getPodUserData, mutatePodUserData, saveImage } = useAuthService()

  const file = ref()
  const userInfo = {
    nickname: null,
    avatat: null,
  };

  const uploaImage = async () => {
    try {
        const formData = new FormData()
        formData.append('files', [file.value])
        console.log("Files", file.value[0]);
        const serviceId = constants.BYOTUBE_SERVICE_ID
        const assetId = uuid.v4()
        const visibility = 'public'
        const domain = localStorage.getItem('domain')
        const { data } = await saveImage(domain, serviceId, assetId, visibility,formData)
    } catch (error) {
      
    }
  }

  return{
    userInfo,
    file,
    uploaImage
  }
};
