import {
  useEmitter,
  useFollow,
  useHelper,
  useLoader,
  useVideo,
} from "@/composables";
import { useChannelService } from "@/services";
import { useAuthStore, useCoreStore } from "@/store";
import { computed, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import { uuid } from "vue-uuid";

export const useChannel = () => {
  const route = useRoute();
  const emitter = useEmitter();

  const { isAuthenticated, isFunded } = toRefs(useAuthStore());
  const coreStore = useCoreStore();

  const {
    loader: followLoading,
    showLoader: showFollowLoading,
    hideLoader: hideFollowLoading,
  } = useLoader();

  const { getChannelDataFromCentralAPI, getShortcutByValue } =
    useChannelService();

  const { getSegmentedVideos } = useVideo();
  const {
    followedAccounts,
    followAccount,
    setFollowed,
    informPodAboutAccountFollow,
    followWithBtLiteAccount,
  } = useFollow();

  const { toQueryString, findThumbnailWithMaxHeight, findAvatarWithMaxHeight } =
    useHelper();

  const remoteId = ref(route.query.member_id);
  const channelName = ref(route.query.channel);
  const channelShortcut = ref(null);
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
  const nonFundedDialog = "nonFundedDialog";
  const sections = ref({
    title: "Videos",
    key: "",
    loading: true,
    videos: [],
    after: null,
    has_next_page: null,
  });

  const channelAvatar = computed(() => {
    return findAvatarWithMaxHeight(channel.value?.channel_thumbnails);
  });

  const channelCover = computed(() => {
    return findThumbnailWithMaxHeight(channel.value?.banners, 720);
  });

  const getFollowing = computed({
    get() {
      return followedAccounts.value;
    },
    set(val) {
      followedAccounts.value = val;
    },
  });

  const isFollowed = computed({
    get() {
      return (
        getFollowing.value &&
        getFollowing.value?.find(
          (item) =>
            item?.member_id === remoteId.value &&
            item?.creator === channelName.value
        )
      );
    },
    set(val) {
      getFollowing.value = null;
    },
  });

  const externalUrls = computed(() => {
    return channel.value?.external_urls
      ?.sort((a, b) => a.priority - b.priority)
      .filter((url) => url?.name !== "YouTube");
  });

  const getChannel = async (memberId, creator) => {
    try {
      loading.value = true;

      const queryObj = {
        creator: creator || channelName.value,
        member_id: memberId || remoteId.value,
      };

      const query = toQueryString(queryObj);
      const { data } = await getChannelDataFromCentralAPI(query);
      channel.value = data?.node;
      return data;
    } catch (error) {
      console.error("Error", error);
    } finally {
      loading.value = false;
    }
  };

  const getChannelVideos = async (load, memberId) => {
    try {
      sections.value.loading = true;
      const data = await getSegmentedVideos(
        channelName.value,
        sections.value.after,
        9,
        {},
        {},
        memberId
      );
      if (!data?.page_info?.has_next_page && !data?.edges?.length) {
        load?.done("empty");
      }
      if (!data?.edges?.length) return;

      sections.value.videos.push(...data?.edges);
      sections.value.after = data?.page_info?.end_cursor;
      load?.done("ok");
    } catch (error) {
      console.log("Error", error);
      load?.done("error");
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

  const followChannelWithBtLiteAccount = async () => {
    try {
      if (!isFunded.value) {
        coreStore.OpenDialog(nonFundedDialog);
        return;
      }
      showFollowLoading();
      await followWithBtLiteAccount(
        channelName.value,
        remoteId.value,
        channel.value.created_timestamp
      );
      emitter.emit("channel-followed");
      setFollowed(remoteId.value);
      getFollowing.value = JSON.parse(
        window.localStorage.getItem("followedAccounts")
      );
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
    return edges
      .map((edge) => {
        return edge?.node?.annotations?.map((channel) => {
          return {
            member_id: edge?.node?.member_id,
            creator: channel,
          };
        });
      })
      ?.flat();
  };

  const shortcutByValue = async (memberId, creator) => {
    try {
      const { data } = await getShortcutByValue(memberId, creator);
      channelShortcut.value = data.shortcut;
    } catch (error) {
      console.error("Error", error);
    }
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
    isFollowed,
    externalUrls,
    channelShortcut,
    getChannel,
    getChannelVideos,
    refreshData,
    followChannel,
    openAuthDialog,
    mapFollowIds,
    shortcutByValue,
    followChannelWithBtLiteAccount,
  };
};
