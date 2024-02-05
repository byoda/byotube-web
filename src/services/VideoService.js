import Api from "@/services/Api";

export default {
  getAll(filter) {
    const queryArray = Object.entries(filter).map(([key, value]) => {
      return value ? `${key}=${value}` : null;
    });

    const queryString = queryArray?.reduce((acc, curr) => {
      if (curr) {
        return `${acc}${curr}&`;
      }
      return acc;
    }, "");

    const query = queryString.slice(0, queryString.length - 1);

    return Api().get(`service/data?${query}`);
  },
  getMemberVideos(url, body = {}) {
    return Api().post(url, body);
  },

  follow({ domain, serviceId }, body) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/network_invites/append`,
      body
    );
  },

  // https://notest.byoda.me/api/v1/data/16384/network_links/query

  getFollowedAccounts({ domain, serviceId }, body) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/network_links/query`,
      body
    );
  },
  informPodAboutFollow({ domain, serviceId }, body) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/network_links_inbound/query`,
      body
    );
  },

  likeVideo({ domain, serviceId }, body) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/append`,
      body
    );
  },

  editLikedVideo({ domain, serviceId }, body) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/update`,
      body
    );
  },
  deleteLikedVideo({ domain, serviceId }, body) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/delete`,
      body
    );
  },

  informPodAboutLike({ domain, serviceId }, body) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions_received/append`,
      body
    );
  },

  getById({ domain, serviceId }, filter) {
    return Api().post(
      `https://${domain}/api/v1/data/${serviceId}/asset_reactions/query`,
      filter
    );
  },
  searchAssets(filter) {
    return Api().get(
      `service/search/asset?text=${filter.text}&num=${filter.num}&offset=${filter.offset}`
    );
  },
  uploadVideo(data, optional) {
    return Api().post("videos", data, optional);
  },
  updateVideo(id, data) {
    return Api().put(`videos/${id}`, data);
  },
  updateViews(id) {
    return Api().put(`videos/${id}/views`);
  },
  uploadThumbnail(id, data) {
    return Api().put(`videos/${id}/thumbnails`, data);
  },
  deleteById(id) {
    return Api().delete(`videos/${id}`);
  },
};
