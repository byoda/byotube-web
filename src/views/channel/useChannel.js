import { useEmitter, useFollow, useLoader, useVideo } from "@/composables";
import { useAuthStore, useCoreStore } from "@/store";
import { computed, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import { uuid } from "vue-uuid";

export const useChannel = () => {
  const route = useRoute();
  const emitter = useEmitter();

  const { isAuthenticated } = toRefs(useAuthStore());
  const coreStore = useCoreStore();

  const {
    loader: followLoading,
    showLoader: showFollowLoading,
    hideLoader: hideFollowLoading,
  } = useLoader();

  const { getChannelData, getSegmentedVideos, getVideosFromPod } = useVideo();
  const {
    followedAccounts,
    followAccount,
    setFollowed,
    informPodAboutAccountFollow,
  } = useFollow();

  const remoteId = ref(route.query.member_id);
  const channelName = ref(route.query.channel);
  const tab = ref(null);
  const loading = ref(false);
  const errored = ref(false);
  const subscribed = ref(false);
  const subscribeLoading = ref(false);
  const showSubBtn = ref(true);
  const nonAuthSubscriptionDialog = "nonAuthSubscription";
  const url = import.meta.env.VITE_APP_URL;
  const items = [
    "Home",
    "Videos",
    "Playlists",
    "Community",
    "Channels",
    "about",
  ];
  const videos = ref({});
  const channel = ref({});
  const details = ref({});
  const sections = ref({
    title: "Videos",
    key: "",
    loading: true,
    videos: [],
    after: null,
    has_next_page: null,
  });

  const channelAvatar = computed(() => {
    if (isAuthenticated.value) {
      channel.value?.channel_thumbnails?.[2]?.url
        ? channel.value?.channel_thumbnails?.[2]?.url
        : channel.value?.creator_thumbnail;
    }
    if (sections.value?.videos.length) {
      const creatorThumbnail = sections.value?.videos[0].node.creator_thumbnail;
      return creatorThumbnail;
    }
  });

  const channelCover = computed(() => {
    if (isAuthenticated.value)
      return channel.value?.banners?.[10]?.url
        ? channel.value?.banners?.[10]?.url
        : channel.value?.creator_thumbnail;

    if (sections.value?.videos.length) {
      const videoThumbnails = sections.value?.videos[0].node.video_thumbnails;
      return videoThumbnails[videoThumbnails?.length - 1]?.url;
    }
  });

  const getFollowing = computed({
    get() {
      return followedAccounts.value;
    },
    set(val) {
      followedAccounts.value = val;
    },
  });

  const getChannel = async () => {
    loading.value = true;
    const queryFilter = {
      filter: {
        creator: {
          eq: channelName.value,
        },
      },
      remote_member_id: remoteId.value,
      depth: 1,
      query_id: uuid.v4(),
    };

    if (isAuthenticated.value) {
      const { data } = await getChannelData(queryFilter);
      channel.value = data?.edges[0]?.node;
    }

    loading.value = false;
  };

  const getChannelVideos = async (event) => {
    const { done } = event;
    try {
      sections.value.loading = true;
      const data = isAuthenticated.value
        ? await getVideosFromPod({
            creator: channelName.value,
            memberId: remoteId.value,
            after: sections.value.after,
          })
        : await getSegmentedVideos(channelName.value, sections.value.after, 9);

      if (!data?.page_info?.has_next_page && !data?.edges?.length) {
        done("empty");
      }
      if (!data?.edges?.length) return;

      sections.value.videos.push(...data?.edges);
      sections.value.after = data?.page_info?.end_cursor;
      done("ok");
    } catch (error) {
      console.log("Error", error);
      done("error");
    } finally {
      sections.value.loading = false;
    }
  };

  const refreshData = async (memberId, channel) => {
    remoteId.value = memberId;
    channelName.value = channel;
    sections.value = {
      title: "Videos",
      key: "",
      loading: true,
      videos: [],
      after: null,
      has_next_page: null,
    };
    if (isAuthenticated.value) {
      await getChannel();
    }
    await getChannelVideos();
  };

  const followChannel = async () => {
    try {
      showFollowLoading();
      const { data } = await followAccount(
        channelName.value,
        remoteId.value,
        channel.value.created_timestamp
      );
      if (data) {
        emitter.emit("channel-followed");
        setFollowed(remoteId.value);
        informPodAboutAccountFollow({
          remote_member_id: remoteId.value,
          depth: 1,
          query_id: uuid.v4(),
        });
        getFollowing.value = JSON.parse(
          window.localStorage.getItem("followedAccounts")
        );
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      hideFollowLoading();
    }
  };

  const openAuthDialog = () => {
    coreStore.OpenDialog(nonAuthSubscriptionDialog);
  };

  const mapFollowIds = (edges) => {
    return edges.map((edge) => edge?.node?.member_id);
  };

  return {
    channelName,
    tab,
    loading,
    errored,
    subscribed,
    subscribeLoading,
    showSubBtn,
    url,
    items,
    videos,
    channel,
    details,
    sections,
    channelAvatar,
    remoteId,
    followedAccounts,
    getFollowing,
    followLoading,
    channelCover,
    getChannel,
    getChannelVideos,
    refreshData,
    followChannel,
    openAuthDialog,
    mapFollowIds,
  };
};
