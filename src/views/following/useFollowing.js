import { useFollow, useHelper, useLoader, useVideo } from "@/composables"
import { useChannelService } from "@/services"
import { useAuthStore } from "@/store"
import { ref, toRefs } from "vue"
import { uuid } from "vue-uuid"



export const useFollowing = () => {

    const { getChannelData } = useVideo()
    const { loader, showLoader, hideLoader } = useLoader()
    const { getFollowedChannels } = useFollow()
    const { getChannelDataFromCentralAPI } = useChannelService();
    const { toQueryString } = useHelper()
    const { isBtLiteAccount } = toRefs(useAuthStore())


    const channels = ref([])

    const getUniqueFollowing = (array) => {
        return array.filter((obj, index) => {
            return array.findIndex(o => o?.value?.channel_id === obj?.value?.channel_id) === index
        })
    }

    const getChannels = async () => {
        try {
            showLoader()
            const { data } = await getFollowedChannels()
            console.log("Data", data);
            const getAllChannels = data?.edges?.map(channel => channel?.node?.annotations?.map(channelAnnotation => getChannel(channel?.node?.member_id, channelAnnotation)))?.flat()
            const allData = await Promise.allSettled(getAllChannels)

            channels.value = getUniqueFollowing(allData)

        } catch (error) {
            console.log("Error", error)
        } finally {
            hideLoader()
        }
    }

    const getChannel = async (memberId, creator) => {
        try{
            const queryObj = {
              creator: creator || channelName.value,
              member_id: memberId || remoteId.value,
            };
        
            const query = toQueryString(queryObj);
            const { data } = await getChannelDataFromCentralAPI(query);
        
            return data?.node
        }catch(error){
            console.error("Error", error)
        }
      };
    

    return {
        channels,
        getChannels,
        getChannel
    }
}