import VideoService from "@/services/VideoService";

export const followMixin = {
  data: () => ({
    initialState: {
      auth_token:
        typeof window !== "undefined" ? localStorage.getItem("token") : null,
      domain:
        typeof window !== "undefined" ? localStorage.getItem("domain") : null,
      isAuthenticated: null,
      user: null,
    },
  }),
  methods: {
    follow: function(channelName, origin, serviceId, createdTimestamp) {
      const body = {
        relation: "follow",
        text: channelName,
        member_id: origin,
        created_timestamp: createdTimestamp,
      };
      return VideoService.follow(
        { domain: this.initialState.domain, serviceId: serviceId },
        { data: body }
      );
    },

    informPodAboutFollow: function({
      serviceId,
      remote_member_id,
      depth,
      query_id,
    }) {
      return VideoService.informPodAboutFollow(
        { domain: this.initialState.domain, serviceId: serviceId },
        { remote_member_id, depth, query_id }
      );
    },

    likeVideo: function(
      relation,
      origin,
      serviceId,
      createdTimestamp,
      assetId
    ) {
      const body = {
        relation,
        member_id: origin,
        created_timestamp: createdTimestamp,
        asset_id: assetId,
      };
      return VideoService.likeVideo(
        { domain: this.initialState.domain, serviceId: serviceId },
        { data: body }
      );
    },
    updateLikedVideo: function(serviceId, data, filter) {
      return VideoService.editLikedVideo(
        { domain: this.initialState.domain, serviceId: serviceId },
        { data, filter }
      );
    },

    informPodAboutLike: function({
      serviceId,
      remote_member_id,
      depth,
      query_id,
      asset_id,
      created_timestamp,
      member_id,
    }) {
      return VideoService.informPodAboutLike(
        { domain: this.initialState.domain, serviceId: serviceId },
        {
          data: { asset_id, created_timestamp, member_id, relation: "like" },
          remote_member_id,
          depth,
          query_id,
        }
      );
    },

    setFollowed(memberId) {
      let alreadyFollowed = JSON.parse(
        localStorage.getItem("followedAccounts")
      );
      if (alreadyFollowed?.length) {
        if (alreadyFollowed?.includes(memberId)) {
          alreadyFollowed = alreadyFollowed.filter(
            (member) => member !== memberId
          );
        } else {
          alreadyFollowed.push(memberId);
        }
        localStorage.setItem(
          "followedAccounts",
          JSON.stringify(alreadyFollowed)
        );
      } else {
        const followedAccounts = [memberId];
        localStorage.setItem(
          "followedAccounts",
          JSON.stringify(followedAccounts)
        );
      }
    },

    getAssetById(serviceId, filter) {
      return VideoService.getById(
        {
          domain: this.initialState.domain,
          serviceId: serviceId,
        },
        filter
      );
    },
  },
};
