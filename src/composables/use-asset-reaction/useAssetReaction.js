import { computed, ref } from "vue";
import { useVideo } from "../use-video/useVideo";
import { useCoreStore } from "@/store";
import { uuid } from "vue-uuid";
import { useAssetReactionService } from "@/services";
import { useHelper } from "../use-helper/useHelper";

export const useAssetReaction = () => {
  const coreStore = useCoreStore();
  const {
    service_id,
    deleteReaction,
    updateLikedVideo,
    informPodAboutLike,
    likeVideo,
    getAllAssetReactions,
  } = useVideo();

  const { toQueryString } = useHelper()

  const { addEditReactionLite, getAssetReactionsLite, getAllAssetReactionsLite } =
    useAssetReactionService();

  const assetReactions = ref([]);
  const LIKE = "like";
  const DISLIKE = "dislike";
  const nonAuthSubscriptionDialog = "nonAuthSubscription";

  const isVideosLikedByCurrentUser = (assetReactions, asset) => {
    return !!assetReactions.find((videeoAsset) => {
      return (
        videeoAsset?.node?.asset_id === asset?.asset_id &&
        videeoAsset?.node?.relation == LIKE
      );
    });
  };

  const isVideoDislikedByCurrentUser = (assetReactions, asset) => {
    return !!assetReactions.find(
      (videeoAsset) =>
        videeoAsset?.node?.asset_id === asset?.asset_id &&
        videeoAsset?.node?.relation == DISLIKE
    );
  };

  const isVideoWatchedByUser = (assetReactions, asset) => {
    return !!assetReactions.find(
      (videeoAsset) =>
        videeoAsset?.node?.asset_id === asset?.asset_id &&
        videeoAsset?.node?.relation == ""
    );
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

  const likeOrDislike = async (relation, assetReactions, asset, memberId) => {
    let updatedData = null;
    let newData = null;

    const { asset_id, created_timestamp } = asset;
    const serviceId = service_id;
    if (
      isVideosLikedByCurrentUser(assetReactions, asset) ||
      isVideoDislikedByCurrentUser(assetReactions, asset) ||
      isVideoWatchedByUser(assetReactions, asset)
    ) {
      if (
        (isVideosLikedByCurrentUser(assetReactions, asset) &&
          relation == LIKE) ||
        (isVideoDislikedByCurrentUser(assetReactions, asset) &&
          relation == DISLIKE)
      ) {
        await deleteAssetReaction(asset);
        return;
      }
      const existingRelation = isVideosLikedByCurrentUser(assetReactions, asset)
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
          member_id: memberId,
          created_timestamp,
          asset_id,
        },
        filter
      );

      updatedData = data;
    } else {
      const { data } = await likeVideo(
        relation,
        memberId,
        service_id,
        asset.created_timestamp,
        asset.asset_id
      );

      newData = data;
    }

    if (newData || updatedData) {
      informPodAboutLike({
        remote_member_id: memberId,
        depth: 1,
        serviceId: service_id,
        query_id: uuid.v4(),
        asset_id: asset.asset_id,
        created_timestamp: asset.created_timestamp,
        member_id: memberId,
      });
    }
  };

  const editLikeOrDislike = async (asset, memberId) => {
    const { data } = await updateLikedVideo(
      "dislike",
      asset.origin,
      service_id,
      asset.created_timestamp,
      asset.asset_id
    );

    if (data) {
      informPodAboutLike({
        remote_member_id: memberId,
        depth: 1,
        serviceId: service_id,
        query_id: uuid.v4(),
        asset_id: asset.asset_id,
        created_timestamp: asset.created_timestamp,
        member_id: memberId,
      });
    }
  };

  const getAssetReactionsById = async (assetId) => {
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

  const deleteAssetReaction = async (asset) => {
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
  const openAuthDialog = () => {
    coreStore.OpenDialog(nonAuthSubscriptionDialog);
  };

  const addOrUpdateReactionLite = async ({ asset, bookmark, relation }) => {
    const {
      origin,
      asset_id,
      asset_url,
      keywords,
      annotations,
      categories,
      list_name,
    } = asset;
    const body = {
      member_id: origin,
      asset_id,
      asset_url,
      asset_class: "public_assets",
      relation,
      bookmark,
      keywords,
      annotations,
      categories,
      list_name,
    };

    return await addEditReactionLite(body);
  };

  const fetchAssetReactionsLite = async ({member_id, asset_id}) => {
    const query = `member_id=${member_id}&asset_id=${asset_id}`
    return getAssetReactionsLite(query)
  };

  const fetchAllAssetReactionsLite = async ({first = 20, after = null}) => {
    const query = toQueryString({first, after})
    return getAllAssetReactionsLite(query)
  };



  return {
    LIKE,
    DISLIKE,
    assetReactions,
    isVideoDislikedByCurrentUser,
    isVideosLikedByCurrentUser,
    likeOrDislike,
    likeVideo,
    deleteAssetReaction,
    editLikeOrDislike,
    followChannel,
    openAuthDialog,
    addOrUpdateReactionLite,
    fetchAssetReactionsLite,
    fetchAllAssetReactionsLite,
  };
};
