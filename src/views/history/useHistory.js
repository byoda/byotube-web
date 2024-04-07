import { useAssetReaction, useVideo } from "@/composables";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { uuid } from "vue-uuid";

export const useHistory = () => {
  const router = useRouter();

  const {
    getSegmentedVideos,
    getAllAssetReactions,
    getVideoByIdFromPod,
    deleteReaction,
    getVideoFromCentralApi,
  } = useVideo();

  const { fetchAllAssetReactionsLite, addOrUpdateReactionLite } =
    useAssetReaction();

  const { likeOrDislike } = useAssetReaction();

  const search = ref("");
  const allAssetReactions = ref([]);
  const key = ref(1);

  const sections = ref({
    title: "",
    key: "",
    loading: true,
    videos: [],
    after: null,
    has_next_page: null,
  });

  const resetSections = () => {
    sections.value = {
      title: "",
      key: "",
      loading: true,
      videos: [],
      after: null,
      has_next_page: null,
    };
  };

  const deleteAllAssetReactions = async () => {
    try {
      const allDeletePromise = allAssetReactions.value.map((asset) => {
        const filter = {
          asset_id: {
            eq: asset?.node?.asset_id,
          },
        };
        return deleteReaction({
          depth: 0,
          query_id: uuid.v4(),
          filter,
        });
      });
      Promise.allSettled(allDeletePromise).then(async () => {
        resetSections();
        await getHistoryVideos(null, sections.value, 10);
      });
    } catch (error) {
      console.error("Error", error);
    }
  };

  const list = [
    {
      title: "Clear all watch history",
      icon: "mdi-trash-can-outline",
      method: async () => {
        await deleteAllAssetReactions();
      },
    },
  ];

  const getHistoryVideos = async ($state, section, first) => {
    try {
      section.loading = true;
      const filter = {
        after: section.after,
        first,
      };
      const { data } = await getAllAssetReactions(null, filter);
      if (data?.edges?.length) $state?.loaded;
      allAssetReactions.value = data?.edges;

      const queryPod = data.edges.map((edge) => {
        return getVideoByIdFromPod({
          assetId: edge?.node?.asset_id,
          memberId:
            edge?.node?.member_id == "e067ee14-a634-4d25-bfe8-d39db6407fc3"
              ? null
              : edge?.node?.member_id,
          depth:
            edge?.node?.member_id == "e067ee14-a634-4d25-bfe8-d39db6407fc3"
              ? 0
              : 1,
        });
      });

      const dataFromPod = (await Promise.allSettled(queryPod)).map(
        (prom) => prom.value?.data?.edges[0]
      );

      section.videos?.push(...dataFromPod);

      section.has_next_page = data?.page_info?.has_next_page;
      if (section.has_next_page) {
        section.after = data?.page_info.end_cursor;
      } else {
        $state?.complete();
      }
      section.loading = false;
      sections.value = section;
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getHistoryVideosBtLite = async ($state, section, first) => {
    try {
      section.loading = true;
      const filter = {
        after: section.after,
        first,
      };
      const { data } = await fetchAllAssetReactionsLite(filter);
      if (data?.edges?.length) $state?.loaded;
      allAssetReactions.value = data?.edges;

      const queryVideos = data.edges.map((edge) => {
        return getVideoFromCentralApi({
          assetId: edge?.node?.asset_id,
          memberId: edge?.node?.member_id,
        });
      });

      const dataFromCentralApi = (await Promise.allSettled(queryVideos)).map(
        (prom) => prom.value?.data
      );

      section.videos?.push(...dataFromCentralApi);

      section.has_next_page = data?.page_info?.has_next_page;
      if (section.has_next_page) {
        section.after = data?.page_info.end_cursor;
      } else {
        $state?.complete();
      }
      section.loading = false;
      sections.value = section;
    } catch (error) {
      console.error("Error", error);
    }
  };

  const saveOrUpdateReactionLite = async ({ relation, node }) => {
    try {
      const asset = allAssetReactions.value?.find(
        (videeoAsset) => videeoAsset?.node?.asset_id === node?.asset_id
      )?.node;

      if (asset?.relation == relation) {
        relation = "";
      }

      asset.origin = asset?.member_id

      await addOrUpdateReactionLite({asset, relation})
      asset.relation = asset?.relation === relation ? "" : relation;
      key.value = key.value + 1;
    } catch (error) {
      console.error("Error", error);
    }
  };

  const mapSegmentedVideos = async ($state, section, first) => {
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
    } else {
      $state?.complete();
    }
    section.loading = false;
    sections.value = section;
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

  const addReaction = async (relation, allAssetReactions, node, origin) => {
    try {
      await likeOrDislike(relation, allAssetReactions, node, origin);
      const asset = allAssetReactions.find(
        (videeoAsset) => videeoAsset?.node?.asset_id === node?.asset_id
      ).node;

      asset.relation = asset.relation === relation ? "" : relation;
      key.value = key.value + 1;
    } catch (error) {
      console.error("Error", error);
    }
  };

  return {
    key,
    list,
    search,
    sections,
    allAssetReactions,
    addReaction,
    moveToWatch,
    getHistoryVideos,
    mapSegmentedVideos,
    getHistoryVideosBtLite,
    saveOrUpdateReactionLite
  };
};
