import { AccountType, constants } from "@/globals/constants";
import { useVideoService } from "@/services";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHelper } from "../use-helper/useHelper";
import { uuid } from "vue-uuid";
import { useAxios } from "../use-axios/useAxios";
import { useDate } from "vuetify/lib/framework.mjs";
import { useBurstPoints } from "../use-burstpoints/useBurstPoints";

export const useVideo = () => {
  const route = useRoute();
  const router = useRouter();

  const { Api } = useAxios();

  const {
    getAll,
    getMemberVideos,
    getChannel,
    appendReaction,
    updateReaction,
    editLikedVideo,
    requestPodAboutLike,
    deleteAssetReaction,
    getAssetReactions,
    queryPodForVideo,
    getAssetFromCentralData,
  } = useVideoService();

  const { attestUserBurstPoints } = useBurstPoints()



  const { compareArrays } = useHelper();

  const loading = ref(false);
  const loaded = ref(false);
  const errored = ref(false);
  const after = ref(null);
  const has_next_page = ref(true);
  const pageKey = ref(0);
  const ingestStatus = ref([]);
  const videos = ref([]);
  const asset = ref({});
  const page = ref(1);
  const key_id = ref(null);
  const content_token = ref(null);
  const videoOptions = ref({});

  const service_id = constants.BYOTUBE_SERVICE_ID;
  const initialState = {
    auth_token:
      typeof window !== "undefined"
        ? window.localStorage.getItem("token")
        : null,
    domain:
      typeof window !== "undefined"
        ? window.localStorage.getItem("domain")
        : null,
    isAuthenticated: null,
    user: null,
  };
  const filter = {
    youtube: "Youtube Hosted",
    byoda: "BYODA Hosted",
  };

  const getVideoOptions = computed(() => videoOptions.value);

  const getSegmentedVideos = async (
    listName = null,
    after = null,
    first = 8,
    ingestStatus = {}, //optional ingest status array for filtering on base external and pod content
    options = null //options to compare with ingest status array and it is required with ingest staus array
  ) => {
    const filter = {
      first: first,
      list_name: listName,
    };

    if (after) {
      filter["after"] = after;
    }

    if (ingestStatus?.value && !compareArrays(ingestStatus, options)) {
      filter["ingest_status"] = ingestStatus?.value;
    }

    const videos = await getAll(filter)
      .catch((err) => {
        console.log(err);
        errored.value = true;
      })
      .finally(() => {
        loading.value = false;
      });

    if (typeof videos === "undefined") return;
    return videos?.data;
  };

  const getServiceVideos = async ($state, listName = null) => {
    if (loaded.value) {
      loading.value = true;
    }

    if (!has_next_page.value) {
      loading.value = false;
      loaded.value = true;
      return;
    }

    const filter = {
      first: 40,
      after: after.value,
      list_name: listName,
    };

    if (
      ingestStatus.value?.length &&
      !compareArrays(ingestStatus.value, options)
    ) {
      filter["ingest_status"] = ingestStatus.value[0].value;
    }

    const { data } = await getAll(filter)
      .catch((err) => {
        console.log(err);
        errored.value = true;
      })
      .finally(() => {
        loading.value = false;
      });

    if (typeof data === "undefined") return;

    if (data.edges.length) {
      page.value += 1;
      has_next_page.value = data?.page_info?.has_next_page;
      if (has_next_page.value) {
        after.value = data?.page_info.end_cursor;
      }
      videos.value?.push(...data.edges);
      $state.loaded();
      loaded.value = true;
    } else {
      $state.complete();
    }

    return videos;
  };

  const getMemberAllVideos = async (
    after = null,
    first = 8,
    ingestStatus = [], //optional ingest status array for filtering on base external and pod content
    options = null //options to compare with ingest status array and it is required with ingest staus array
  ) => {
    try {
      const bodyFilter = {
        first: first,
        filter: {},
      };

      if (after) {
        bodyFilter["after"] = after;
      }

      if (ingestStatus?.length && !compareArrays(ingestStatus, options)) {
        bodyFilter.filter["ingest_status"] = {};
        bodyFilter.filter.ingest_status["eq"] = ingestStatus[0].value;
      }
      let host_url = "";
      if (initialState.domain) {
        host_url = `https://${initialState.domain}`;
      }

      const data_url = `${host_url}/api/v1/data/${service_id}/feed_assets/query`;

      const { data } = await getMemberVideos(data_url, bodyFilter);

      if (typeof data === "undefined") return;

      return data;
    } catch (error) {
      console.log(error);
      errored.value = true;
    } finally {
      loading.value = false;
    }
  };

  const getVideos = async ($state) => {
    initialState.auth_token
      ? await getMemberAllVideos($state)
      : await getServiceVideos($state);
  };

  const getChannelData = (filter) => {
    return getChannel(
      { domain: initialState.domain, serviceId: service_id },
      filter
    );
  };

  const changeVideo = (assetData) => {
    if (!assetData) return;

    asset.value = {
      ...assetData,
      video_thumbnail:
        assetData.video_thumbnails[assetData.video_thumbnails.length - 1],
    };

    key_id.value = assetData.key_id;
    content_token.value = assetData.content_token;

    if (key_id) {
      asset.asset_url += `?key_id=${key_id}`;
    }

    let type = "application/dash+xml";
    if (asset.value.ingest_status == "external") {
      type = "video/youtube";
    }

    videoOptions.value = {
      autoplay: false,
      controls: true,
      responsive: true,

      poster: asset.value?.video_thumbnail.url,
      sources: [
        {
          src: asset.value?.asset_url,
          type: type,
        },
      ],
    };

    if (asset.ingest_status == "external") {
      videoOptions.value["techOrder"] = ["youtube"];
    }
  };

  const isAttestationSixtyMinutesOld = () => {
    const attestation = JSON.parse(localStorage.getItem("attestation"));
    return ((new Date() - new Date(attestation?.created_timestamp))/60000) > 60
  }

  const getItem = async (edge) => {
    const SIGNEDBY = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    const SIGNED_TOKEN = "dummy";

    if(isAttestationSixtyMinutesOld()){
      await attestUserBurstPoints()
    }

    const attestation = JSON.parse(localStorage.getItem("attestation"));
    const memberIdType = localStorage.getItem("id_type")
    const memberId = localStorage.getItem("member_id")

    let asset = edge.node;
    asset.origin = edge.origin;
    const body = {
      service_id: constants.BYOTUBE_SERVICE_ID,
      asset_id: asset.asset_id,
      member_id: memberId,
      member_id_type: memberIdType,
      attestation: attestation,
    };
    if(!memberIdType){
      delete body.member_id
      delete body.member_id_type
    }
    if (asset.ingest_status != "external") {
      let apiUrl = `https://proxy.${constants.BYODA_NETWORK}/${constants.BYOTUBE_SERVICE_ID}/${edge.origin}/api/v1/pod/content/token`;

      const { data } = await Api.post(apiUrl, body);

      asset = {
        ...asset,
        key_id: data.key_id,
        content_token: data.content_token,
      };
    }
    return asset;
  };

  const likeVideo = (
    relation,
    origin,
    serviceId,
    createdTimestamp,
    assetId
  ) => {
    const body = {
      relation,
      member_id: origin,
      created_timestamp: createdTimestamp,
      asset_id: assetId,
    };
    return appendReaction(
      { domain: initialState.domain, serviceId: serviceId },
      { data: body }
    );
  };

  const appendVideoReactions = ({
    origin,
    createdTimestamp,
    assetId,
    categories,
    annotations,
    bookmark,
  }) => {
    const body = {
      relation: "",
      member_id: origin,
      created_timestamp: createdTimestamp,
      asset_id: assetId,
      bookmark,
      categories,
      annotations,
    };
    return appendReaction(
      { domain: initialState.domain, serviceId: service_id },
      { data: body }
    );
  };
  const updateVideoReactions = ({
    origin,
    createdTimestamp,
    assetId,
    categories,
    annotations,
    bookmark,
  }) => {
    const body = {
      relation: "",
      member_id: origin,
      created_timestamp: createdTimestamp,
      asset_id: assetId,
      bookmark,
      categories,
      annotations,
    };
    const filter = {
      asset_id: {
        eq: assetId,
      },
    };
    return updateReaction(
      { domain: initialState.domain, serviceId: service_id },
      { data: body, filter }
    );
  };

  const updateLikedVideo = (serviceId, data, filter) => {
    return editLikedVideo(
      { domain: initialState.domain, serviceId: serviceId },
      { data, filter }
    );
  };

  const informPodAboutLike = ({
    serviceId,
    remote_member_id,
    depth,
    query_id,
    asset_id,
    created_timestamp,
    member_id,
  }) => {
    return requestPodAboutLike(
      { domain: initialState.domain, serviceId: serviceId },
      {
        data: { asset_id, created_timestamp, member_id, relation: "like" },
        remote_member_id,
        depth,
        query_id,
      }
    );
  };

  const deleteReaction = ({ serviceId, depth, query_id, filter }) => {
    return deleteAssetReaction(
      { domain: initialState.domain, serviceId: serviceId || service_id },
      { depth, query_id, filter }
    );
  };

  const deleteReactionBtLiteAccount = ({ member_id, relation, annotation }) => {
    return deleteAssetReaction({ member_id, relation, annotation });
  };

  const deleteAllReactions = ({ depth, query_id, filter }) => {
    return deleteAssetReaction(
      { domain: initialState.domain, serviceId: service_id },
      { depth, query_id, filter }
    );
  };

  const getAllAssetReactions = (serviceId, filter) => {
    return getAssetReactions(
      {
        domain: initialState.domain,
        serviceId: serviceId ? serviceId : service_id,
      },
      filter
    );
  };

  const getVideoByIdFromPod = async ({ assetId, memberId, depth = 1 }) => {
    const body = {
      depth: depth,
      query_id: uuid.v4(),
      remote_member_id: memberId,
      filter: {
        asset_id: {
          eq: assetId,
        },
      },
    };

    return queryPodForVideo(
      {
        domain: initialState.domain,
        serviceId: service_id,
      },
      body
    );
  };

  const getVideoFromFeedAsset = async ({ assetId, memberId, depth = 1 }) => {
    const body = {
      depth: depth,
      query_id: uuid.v4(),
      remote_member_id: memberId,
      filter: {
        asset_id: {
          eq: assetId,
        },
      },
    };

    let host_url = "";
    if (initialState.domain) {
      host_url = `https://${initialState.domain}`;
    }

    const data_url = `${host_url}/api/v1/data/${service_id}/feed_assets/query`;
    return getMemberVideos(data_url, body);
  };

  const getVideosFromPod = async ({ creator, memberId, after, first = 9 }) => {
    const body = {
      depth: 1,
      query_id: uuid.v4(),
      remote_member_id: memberId,
      after,
      first,
      filter: {
        creator: {
          eq: creator,
        },
      },
    };

    const { data } = await queryPodForVideo(
      {
        domain: initialState.domain,
        serviceId: service_id,
      },
      body
    );

    return data;
  };
  const getVideoFromCentralApi = async ({ assetId, memberId, cursor }) => {
    let query = "";
    if (assetId && memberId)
      query = `asset_id=${assetId}&member_id=${memberId}`;
    else if (cursor) query = `cursor=${cursor}`;

    return getAssetFromCentralData(query);
  };

  const moveToWatch = (video) => {
    let query = "";
    if (video?.node?.asset_id || video?.origin) {
      query = {
        asset_id: video?.node?.asset_id,
        member_id: video?.origin,
      };
    } else {
      query = {
        cursor: video?.cursor,
      };
    }
    router.push({ name: "Watch", query });
  };

  return {
    loading,
    loaded,
    errored,
    after,
    has_next_page,
    pageKey,
    videos,
    asset,
    page,
    key_id,
    content_token,
    videoOptions,
    service_id,
    initialState,
    filter,
    getVideoOptions,
    getSegmentedVideos,
    getServiceVideos,
    getMemberAllVideos,
    getVideos,
    getChannelData,
    changeVideo,
    getItem,
    likeVideo,
    updateLikedVideo,
    informPodAboutLike,
    deleteReaction,
    getAllAssetReactions,
    getVideoByIdFromPod,
    getVideoFromCentralApi,
    appendVideoReactions,
    updateVideoReactions,
    moveToWatch,
    getVideosFromPod,
    deleteAllReactions,
    getVideoFromFeedAsset,
    deleteReactionBtLiteAccount,
  };
};
