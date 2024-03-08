import {
  useAlert,
  useFollow,
  useHelper,
  useLoader,
  useVideo,
} from "@/composables";
import { useAuthStore, useCoreStore } from "@/store";
import { computed, ref, toRaw, toRef, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { uuid } from "vue-uuid";

export const useWatch = () => {
  const route = useRoute();
  const router = useRouter();

  const { isAuthenticated } = toRefs(useAuthStore());
  const coreStore = useCoreStore();

  const { showError } = useAlert();
  const { convertSecondsToMinutesAndSeconds } = useHelper();
  const {
    loader: videoLoading,
    showLoader: showVideoLoader,
    hideLoader: hideVideoLoader,
  } = useLoader();
  const {
    service_id,
    deleteReaction,
    updateLikedVideo,
    informPodAboutLike,
    likeVideo,
    getAllAssetReactions,
    getAssetReactionsByIdFromPod,
    getVideoByIdFromPod,
    getVideoFromCentralApi,
    getItem,
    appendVideoReactions,
    updateVideoReactions,
    getSegmentedVideos,
    getVideoFromFeedAsset,
  } = useVideo();
  const {
    followedAccounts,
    followAccount,
    setFollowed,
    informPodAboutAccountFollow,
  } = useFollow();

  const assetId = ref(route.query?.asset_id);
  const memberId = ref(route.query?.member_id);
  const cursor = ref(route.query?.v);
  const asset = ref({});
  const subscribed = ref(false);
  const subscribeLoading = ref(false);
  const showSubBtn = ref(true);
  const feeling = ref("");
  const video = ref({});
  const videoId = ref("");
  const infiniteId = ref(new Date());
  const truncate = ref(true);
  const url = import.meta.env.VITE_APP_URL;
  const signinDialog = ref(false);
  const details = ref({});
  const videoOptions = ref({});
  const key_id = ref("");
  const content_token = ref("");
  const assetReactions = ref([]);
  const playerKey = ref(0);
  const showFull = ref(false);
  const videoJs = ref();
  const videoNotfound = ref(false);
  const rightPanelVideos = ref({
    title: "",
    key: "",
    loading: true,
    videos: [],
    after: null,
    has_next_page: null,
  });

  const EXTERNAL = "external";
  const LIKE = "like";
  const DISLIKE = "dislike";
  const nonAuthSubscriptionDialog = "nonAuthSubscription";
  const copyUrlDialog = "copyUrlDialog";

  const isVideosLikedByCurrentUser = computed(() => {
    return !!assetReactions.value.find(
      (videeoAsset) =>
        videeoAsset?.node?.asset_id === asset.value?.asset_id &&
        videeoAsset?.node?.relation == LIKE
    );
  });
  const isVideoDislikedByCurrentUser = computed(() => {
    return !!assetReactions.value.find(
      (videeoAsset) =>
        videeoAsset?.node?.asset_id === asset.value?.asset_id &&
        videeoAsset.node.relation == DISLIKE
    );
  });

  const getFollowing = computed({
    get() {
      return followedAccounts.value;
    },
    set(val) {
      followedAccounts.value = val;
    },
  });

  const getVideoOptions = computed(() => videoOptions.value);

  const openAuthDialog = () => {
    coreStore.OpenDialog(nonAuthSubscriptionDialog);
  };

  const openCopyUrlDialog = () => {
    coreStore.OpenDialog(copyUrlDialog);
  };

  const getVideo = async () => {
    try {
      showVideoLoader();
      videoNotfound.value = false;

      let assetData = null;

      // if (
      //   isAuthenticated.value &&
      //   assetId.value &&
      //   memberId.value &&
      //   followedAccounts.value.includes(memberId.value)
      // ) {
      //   const { data } = await getVideoFromFeedAsset({
      //     assetId: assetId.value,
      //     memberId: memberId.value,
      //   });
      //   assetData = await getItem(data.edges[0]);
      // } else {
      const { data } = await getVideoFromCentralApi({
        assetId: assetId.value,
        memberId: memberId.value,
        cursor: cursor.value,
      });
      assetData = await getItem(data);
      // }

      if (!assetData) {
        videoNotfound.value = true;
        return;
      }

      asset.value = {
        ...assetData,
        video_thumbnail:
          assetData.video_thumbnails[assetData.video_thumbnails.length - 1],
      };

      key_id.value = assetData.key_id;
      content_token.value = assetData.content_token;

      if (key_id.value) {
        asset.value.asset_url += `?key_id=${key_id.value}`;
      }

      let type = "application/dash+xml";
      if (asset.value.ingest_status == "external") {
        type = "video/youtube";
      }

      videoOptions.value = {
        userActions: {
          click: async (event) => {
            const { minutes, seconds } = convertSecondsToMinutesAndSeconds(
              videoJs.value?.currentTime()?.toString()
            );

            await updateReactionAndBookmark(
              asset.value,
              videoJs.value?.currentTime()?.toString()
            );
          },
        },
        autoplay: true,
        controls: true,
        responsive: true,
        poster: asset.value.video_thumbnail.url,
        sources: [
          {
            src: asset.value.asset_url,
            type: type,
          },
        ],
        youtube: { enablePrivacyEnhancedMode: true },
        aspectRatio: "16:9",
      };

      if (asset.value.ingest_status == "external") {
        videoOptions.value["techOrder"] = ["youtube"];
        // videoJsOptions['autoplay'] = true;
      }

      playerKey.value++;
    } catch (error) {
      console.log("Error", error);
      videoNotfound.value = true;
    } finally {
      hideVideoLoader();
    }
  };

  const followChannel = async () => {
    const { data } = await followAccount(
      asset.value.creator,
      asset.value.origin,
      asset.value.created_timestamp
    );
    if (data) {
      setFollowed(asset.value.origin);
      informPodAboutAccountFollow({
        remote_member_id: asset.value.origin,
        depth: 1,
        query_id: uuid.v4(),
      });
      followedAccounts.value = JSON.parse(
        window.localStorage.getItem("followedAccounts")
      );
    }
  };

  const likeOrDislike = async (relation) => {
    let updatedData = null;
    let newData = null;

    const { asset_id, origin, created_timestamp } = asset.value;
    const serviceId = service_id;
    if (
      isVideosLikedByCurrentUser.value ||
      isVideoDislikedByCurrentUser.value
    ) {
      if (
        (isVideosLikedByCurrentUser.value && relation == LIKE) ||
        (isVideoDislikedByCurrentUser.value && relation == DISLIKE)
      ) {
        deleteAssetReaction();
        assetReactions.value = [];
        assetReactions.value = await getAssetReactionsById(asset_id);
        return;
      }
      const existingRelation = isVideosLikedByCurrentUser.value
        ? "dislike"
        : "like";
      const filter = {
        asset_id: {
          eq: asset_id,
        },
      };
      const { data } = await updateLikedVideo(
        serviceId,
        {
          relation: existingRelation,
          member_id: origin,
          created_timestamp,
          asset_id,
        },
        filter
      );

      updatedData = data;
      assetReactions.value = [];
      assetReactions.value = await getAssetReactionsById(asset_id);
    } else {
      const { data } = await likeVideo(
        relation,
        asset.value.origin,
        service_id,
        asset.value.created_timestamp,
        asset.value.asset_id
      );

      newData = data;
      assetReactions.value = [];
      assetReactions.value = await getAssetReactionsById(asset_id);
    }

    if (newData || updatedData) {
      informPodAboutLike({
        remote_member_id: asset.value.origin,
        depth: 1,
        serviceId: service_id,
        query_id: uuid.v4(),
        asset_id: asset.value.asset_id,
        created_timestamp: asset.value.created_timestamp,
        member_id: asset.value.origin,
      });
    }
  };

  const editLikeOrDislike = async () => {
    const { data } = await updateLikedVideo(
      "dislike",
      asset.value.origin,
      service_id,
      asset.value.created_timestamp,
      asset.value.asset_id
    );

    if (data) {
      informPodAboutLike({
        remote_member_id: asset.value.origin,
        depth: 1,
        serviceId: service_id,
        query_id: uuid.v4(),
        asset_id: asset.value.asset_id,
        created_timestamp: asset.value.created_timestamp,
        member_id: asset.value.origin,
      });
    }
  };

  const getAssetReactionsById = async (assetId) => {
    console.log("Asset Id", assetId);
    try {
      const filter = {
        filter: {
          asset_id: {
            eq: assetId,
          },
        },
      };
      const { data } = await getAllAssetReactions(service_id, filter);
      return data?.edges;
    } catch (error) {
      console.error("Error", error);
      return [];
    }
  };

  const deleteAssetReaction = async () => {
    const { asset_id } = asset;
    try {
      const filter = {
        asset_id: {
          eq: asset_id,
        },
      };
      await deleteReaction({
        serviceId: service_id,
        depth: 0,
        query_id: uuid.v4(),
        filter,
      });
    } catch (error) {
      console.error("Error", error);
      return [];
    }
  };

  const replaceVideo = async (video) => {
    let query = "";
    if (video?.node?.asset_id || video?.origin) {
      query = {
        asset_id: video?.node?.asset_id,
        member_id: video?.origin,
      };

      assetId.value = video?.node?.asset_id;
      memberId.value = video?.origin;
    } else {
      query = {
        cursor: video?.cursor,
      };
      cursor.value = video?.cursor;
    }
    router.push({ name: "Watch", query });

    await getVideo();
  };

  const addReactionAndBookmark = async (asset) => {
    const { annotations, categories, asset_id, created_timestamp } = asset;
    const { data } = await appendVideoReactions({
      annotations,
      categories,
      assetId: asset_id,
      createdTimestamp: created_timestamp,
      bookmark: "0",
      origin: memberId.value,
    });
  };

  const updateReactionAndBookmark = async (asset, bookmark) => {
    const { annotations, categories, asset_id, created_timestamp } = asset;

    const { data } = await updateVideoReactions({
      annotations,
      categories,
      assetId: asset_id,
      createdTimestamp: created_timestamp,
      bookmark,
      origin: memberId.value,
    });
  };

  const mapSegmentedVideos = async (section, first, $state) => {
    const { done } = $state;
    console.log("State", $state);
    try {
      section.loading = true;
      const videosData = await getSegmentedVideos(
        section?.key,
        section?.after,
        first
      );

      if (videosData.length) $state?.loaded;
      section.videos?.push(...videosData.edges);
      section.has_next_page = videosData?.page_info?.has_next_page;
      if (section.has_next_page) {
        section.after = videosData?.page_info.end_cursor;
        done("ok");
      } else {
        done("empty");
      }
      section.loading = false;
      rightPanelVideos.value = section;
    } catch (error) {
      console.error("Error watch", error);
      done("error");
    }
  };

  const mapFollowIds = (edges) => {
    return edges.map((edge) => edge?.node?.member_id);
  };

  return {
    asset,
    videoLoading,
    subscribed,
    subscribeLoading,
    showSubBtn,
    feeling,
    video,
    videoId,
    infiniteId,
    truncate,
    url,
    signinDialog,
    details,
    videoOptions,
    key_id,
    content_token,
    assetReactions,
    EXTERNAL,
    LIKE,
    DISLIKE,
    isVideoDislikedByCurrentUser,
    isVideosLikedByCurrentUser,
    getVideoOptions,
    playerKey,
    assetId,
    memberId,
    cursor,
    showFull,
    videoJs,
    getFollowing,
    rightPanelVideos,
    videoNotfound,
    getVideo,
    followChannel,
    likeOrDislike,
    editLikeOrDislike,
    getAssetReactionsById,
    deleteAssetReaction,
    replaceVideo,
    addReactionAndBookmark,
    openAuthDialog,
    openCopyUrlDialog,
    mapSegmentedVideos,
    mapFollowIds,
  };
};