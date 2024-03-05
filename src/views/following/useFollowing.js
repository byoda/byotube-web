import { useFollow, useLoader, useVideo } from "@/composables"
import { ref } from "vue"
import { uuid } from "vue-uuid"



export const useFollowing = () => {

    const { getChannelData } = useVideo()
    const { loader, showLoader, hideLoader } = useLoader()
    const { getFollowedChannels } = useFollow()

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
            const channelsPromise = await Promise.allSettled( data.edges.map(async (edge) => {
                const data = await getChannel(edge?.node?.annotations[0], edge?.node?.member_id)
                return data
            }))

            channels.value = getUniqueFollowing(channelsPromise)

        } catch (error) {
            console.log("Error", error)
        } finally {
            hideLoader()
        }
    }

    const getChannel = async (channelName, member_id) => {
        try {
            const queryFilter = {
                filter: {
                    creator: {
                        eq: channelName,
                    },
                },
                remote_member_id: member_id,
                depth: 1,
                query_id: uuid.v4(),
            };

            const { data } = await getChannelData(queryFilter);
            return data?.edges[0]?.node;
        } catch (error) {
            console.log("Erorr", error);
        }

    };

    return {
        channels,
        getChannels,
        getChannel
    }
}