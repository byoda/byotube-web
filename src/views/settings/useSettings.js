import { useEmitter } from "@/composables";
import { constants } from "@/globals/constants";
import { useAuthService } from "@/services";
import { useCoreStore } from "@/store";
import { ref } from "vue";
import { uuid } from "vue-uuid";

export const useSettings = () => {

  const { getPodUserData, mutatePodUserData, mutateLiteUserData, saveImage } = useAuthService();
  const coreStore = useCoreStore()
  const emitter = useEmitter()

  const files = ref();
  const user = JSON.parse(localStorage.getItem("user"));
  const userInfo = ref(
    user || {
      nick: null,
      avatar: null,
      show_external_assets: null
    }
  );
  const domain = localStorage.getItem("domain");

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      for (let file = 0; file < files.value?.length; file++) {
        const element = files.value[file];
        formData.append("files", element);
      }
      const serviceId = constants.BYOTUBE_SERVICE_ID;
      const assetId = '00000000-0000-0000-0000-000000000000';
      const visibility = "public";
      const { data } = await saveImage(
        domain,
        serviceId,
        assetId,
        visibility,
        formData
      );
      return data
    } catch (error) {
      console.error("Error", error)
    }
  };

  const emitFilter = ()  => {
    if(!userInfo.value?.show_external_assets){
      coreStore.filter = { "name": "BYODA Hosted", "value": "published" }
    }else{
      coreStore.filter = { "name": "All", "value": "" }
    }
    emitter.emit('filter-changed', coreStore.filter)
  }

  const updateUserData = async () => {
    try {
      let data = null
      if(files.value?.length){
        data =  await uploadImage()
      }
      const body = {
        query_id: uuid.v4(),
        data: {
          nick: userInfo.value?.nick,
          show_external_assets: userInfo.value?.show_external_assets,
          avatar_url: data?.cdn_urls[0] || userInfo.value.avatar_url
        },
      };
      await mutatePodUserData(domain, body);
      emitFilter()
      const { data: userData } = await getPodUserData(domain)
      localStorage.setItem('user', JSON.stringify(userData?.edges[0].node))
      userInfo.value = userData?.edges[0].node
      files.value = null
    } catch (error) {}
  };

  const updateLiteUserData = async () => {
    try {
      const body = {
          nick: userInfo.value?.nick,
          show_external_assets: userInfo.value?.show_external_assets
      };
      await mutateLiteUserData(body);
      emitFilter()
    } catch (error) {}
  };

  return {
    userInfo,
    files,
    user,
    uploadImage,
    updateUserData,
    updateLiteUserData
  };
};
