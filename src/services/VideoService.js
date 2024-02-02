import Api from "@/services/Api";

export default {
  getAll(filter) {
    return Api().get(
      `service/data?${filter.first ? "first=" + filter.first + "&" : ""}${
        filter.list_name ? "list_name=" + filter.list_name + "&" : ""
      }${filter.after ? "after=" + filter.after + "&" : ""}${
        filter.ingest_status
          ? "ingest_status=" + filter.ingest_status + "&"
          : ""
      }`
    );
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
