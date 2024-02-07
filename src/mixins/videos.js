import VideoService from "@/services/VideoService";
import { constants } from "@/globals/contants";
export const videosMixin = {
  data: () => ({
    loading: false,
    loaded: false,
    errored: false,
    after: null,
    has_next_page: true,
    pageKey: 0,
    videos: [],
    service_id: process.env.VUE_APP_BYOTUBE_SERVICE_ID,
    page: 1,
    initialState: {
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
    },
    followedAccounts: null,
    filter: {
      youtube: "Youtube Hosted",
      byoda: "BYODA Hosted",
    },
    ingestStatus: [],
    asset: {},
  }),
  methods: {
    async getSegmentedVideos(listName = null, after = null, first = 8) {
      const filter = {
        first: first,
        list_name: listName,
      };

      if (after) {
        filter["after"] = after;
      }

      if (
        this.ingestStatus.length &&
        !this.compareArrays(this.ingestStatus, this.options)
      ) {
        filter["ingest_status"] = this.ingestStatus[0].value;
      }

      const videos = await VideoService.getAll(filter)
        .catch((err) => {
          console.log(err);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });

      if (typeof videos === "undefined") return;
      return videos.data;
    },
    async getServiceVideos($state, listName = null) {
      if (!this.loaded) {
        this.loading = true;
      }

      if (!this.has_next_page) {
        this.loading = false;
        // $state.complete();
        this.loaded = true;
        return;
      }

      const filter = {
        first: 40,
        after: (() => this.after)(),
        list_name: listName,
      };

      if (
        this.ingestStatus.length &&
        !this.compareArrays(this.ingestStatus, this.options)
      ) {
        filter["ingest_status"] = this.ingestStatus[0].value;
      }

      const videos = await VideoService.getAll(filter)
        .catch((err) => {
          console.log(err);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });

      if (typeof videos === "undefined") return;

      if (videos.data.edges.length) {
        this.page += 1;
        this.has_next_page = videos?.data?.page_info?.has_next_page;
        if (this.has_next_page) {
          this.after = videos?.data?.page_info.end_cursor;
        }
        this.videos.push(...videos.data.edges);
        $state.loaded();
        this.loaded = true;
      } else {
        $state.complete();
      }

      return videos;
    },

    async getMemberVideos($state, listName = "") {
      console.log("List", listName);
      if (!this.loaded) {
        this.loading = true;
      }

      if (!this.has_next_page) {
        this.loading = false;
        $state.complete();
        this.loaded = true;
        return;
      }

      let host_url = "";
      if (this.initialState.domain) {
        host_url = `https://${this.initialState.domain}`;
      }

      const filter = {
        first: 40,
        after: (() => this.after)(),
      };

      if (
        this.ingestStatus.length &&
        !this.compareArrays(this.ingestStatus, this.options)
      ) {
        filter["filter"] = {
          ingest_status: {
            eq: this.ingestStatus[0].value,
          },
        };
      }

      const data_url = `${host_url}/api/v1/data/${this.service_id}/feed_assets/query`;

      const videos = await VideoService.getMemberVideos(data_url, filter)
        .catch((err) => {
          console.log(err);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });

      if (typeof videos === "undefined") return;

      if (videos.data.edges.length) {
        this.page += 1;
        this.has_next_page = videos?.data?.page_info?.has_next_page;
        if (this.has_next_page) {
          this.after = videos?.data?.page_info?.end_cursor;
        }
        this.videos.push(...videos.data.edges);
        $state?.loaded();
        this.loaded = true;
      } else {
        $state.complete();
      }
    },
    async getVideos($state) {
      this.initialState.auth_token
        ? await this.getMemberVideos($state)
        : await this.getServiceVideos($state);
    },

    async followChannel(asset, origin) {
      const { creator, created_timestamp } = asset;
      const { data } = await this.follow(
        creator,
        origin,
        this.service_id,
        created_timestamp
      );
      if (data) {
        this.setFollowed(origin);
      }
      this.followedAccounts = JSON.parse(
        window.localStorage.getItem("followedAccounts")
      );
    },
    getFollowedChannels: function(serviceId) {
      return VideoService.getFollowedAccounts(
        { domain: this.initialState.domain, serviceId: serviceId },
        {}
      );
    },
    getChannelData: function(filter) {
      return VideoService.getChannel(
        { domain: this.initialState.domain, serviceId: this.service_id },
        filter
      );
    },
    async changeVideo(assetData) {
      if (!assetData) return;

      this.asset = {
        ...assetData,
        video_thumbnail:
          assetData.video_thumbnails[assetData.video_thumbnails.length - 1],
      };

      this.key_id = assetData.key_id;
      this.content_token = assetData.content_token;

      if (this.key_id) {
        this.asset.asset_url += `?key_id=${this.key_id}`;
      }

      this.type = "application/dash+xml";
      if (this.asset.ingest_status == "external") {
        this.type = "video/youtube";
      }

      this.videoOptions = {
        autoplay: false,
        controls: true,
        responsive: true,

        poster: this.asset.video_thumbnail.url,
        sources: [
          {
            src: this.asset.asset_url,
            type: this.type,
          },
        ],
      };

      if (this.asset.ingest_status == "external") {
        this.videoOptions["techOrder"] = ["youtube"];
      }
    },

    getItem(edge) {
      const SIGNEDBY = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
      const SIGNED_TOKEN = "dummy";

      let asset = edge.node;
      asset.origin = edge.origin;
      if (asset.ingest_status != "external") {
        let apiUrl = `https://proxy.${constants.BYODA_NETWORK}/${constants.BYOTUBE_SERVICE_ID}/${edge.origin}/api/v1/pod/content/token?asset_id=${asset.asset_id}&service_id=${constants.BYOTUBE_SERVICE_ID}&signedby=${SIGNEDBY}&token=${SIGNED_TOKEN}&ingest_status=${asset.ingest_status}`;
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            asset = {
              ...asset,
              key_id: data.key_id,
              content_token: data.content_token,
            };
            localStorage.setItem("watch", JSON.stringify(asset));
            this.changeVideo(asset);
            if (this.$route.name !== "Watch") {
              this.$router.push({ name: "Watch" });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        localStorage.setItem("watch", JSON.stringify(asset));
        this.changeVideo(asset);
        if (this.$route.name !== "Watch") {
          this.$router.push({ name: "Watch" });
        }
      }

      this.pageKey++;
    },
  },
};
