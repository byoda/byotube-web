<template>
  <div id="home" class="pa-4">
    <v-container fluid>
      <v-alert prominent type="error" v-if="errored">
        <v-row align="center">
          <v-col class="grow">
            <div class="title">Error!</div>
            <div>
              Something went wrong, but don’t fr et — let’s give it another
              shot.
            </div>
          </v-col>
          <v-col class="shrink">
            <v-btn @click="getVideos">Take action</v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <main v-else>
        <div class="d-flex justify-space-between">
          <h3 class="headline font-weight-medium">
            {{
              $store.getters.isAuthenticated
                ? "From your network"
                : "Recommended"
            }}
          </h3>
        </div>
        <div> 
          <div class="grid-layout">
            <div
              v-for="(video, i) in loading ? 12 : videos"
              :key="i"
              class="py-6"
              @click="getItem(video)"
              :followed-accounts="followedAccounts"
              style=" position: relative;"
            >
              <v-skeleton-loader style="" type="card-avatar" :loading="loading">
                <video-card
                  :card="{ maxWidth: 370 }"
                  :video="video.node"
                  :channel="video.origin"
                  @follow="followChannel(video.node, video.origin)"
                  style="position: absolute; width: 100%;"
                ></video-card>
              </v-skeleton-loader>
            </div>
          </div>
          <div class="text-center" v-if="videos.length === 0 && !loading">
            <p>No videos yet</p>
          </div>
          <div cols="12" sm="12" md="12" lg="12">
            <infinite-loading @infinite="getVideos($event, '')">
              <div slot="spinner">
                <v-progress-circular
                  indeterminate
                  :loading="loading"
                  color="red"
                ></v-progress-circular>
              </div>
              <div slot="no-results"></div>
              <span slot="no-more"></span>
              <div slot="error" slot-scope="{ trigger }">
                <v-alert prominent type="error">
                  <v-row align="center">
                    <v-col class="grow">
                      <div class="title">Error!</div>
                      <div>
                        Something went wrong, but don’t fret — let’s give it
                        another shot.
                      </div>
                    </v-col>
                    <v-col class="shrink">
                      <v-btn @click="trigger">Take action</v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
              </div>
            </infinite-loading>
          </div>
        </div>
        <v-col class="text-center" v-if="!has_next_page">
          <p>No more videos</p>
        </v-col>
      </main>
    </v-container>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import moment from "moment";
import VideoCard from "@/components/VideoCard";
import VideoService from "@/services/VideoService";
import { constants } from "@/globals/contants";
import { followMixin } from "@/mixins/follow.js";
import { helperMixin } from "@/mixins/helper.js";

export default {
  name: "Home",
  mixins: [followMixin, helperMixin],
  components: {
    VideoCard,
    InfiniteLoading,
  },
  data: () => ({
    options: [
      { name: "YouTube Hosted", value: "external" },
      { name: "BYODA Hosted", value: "published" },
    ],
    loading: false,
    loaded: false,
    errored: false,
    after: null,
    has_next_page: true,
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
  }),
  methods: {
    async getServiceVideos($state) {
      if (!this.loaded) {
        this.loading = true;
      }

      if (!this.has_next_page) {
        this.loading = false;
        $state.complete();
        this.loaded = true;
        return;
      }

      const filter = {
        first: 40,
        after: (() => this.after)(),
      };

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
          this.after += videos?.data?.total_count;
        }
        this.videos.push(...videos.data.edges);
        $state.loaded();
        this.loaded = true;
      } else {
        $state.complete();
      }
    },
    async getMemberVideos($state) {
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
      console.log(
        "OPt",
        this.options.map((opt) => opt.name),
        this.ingestStatus
      );
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
      console.log("Inside methods");
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
    dateFormatter(date) {
      return moment(date).fromNow();
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
            this.$router.push({ name: "Watch" });
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        localStorage.setItem("watch", JSON.stringify(asset));
        this.$router.push({ name: "Watch" });
      }
    },
  },
  mounted() {
    this.followedAccounts =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("followedAccounts"))
        : null;
    this.$root.$on("filter-changed", ($event) => {
      (this.ingestStatus = $event)
        this.after = null
        this.loaded = false
        this.videos = []
        this.getVideos();
    });
  },
  beforeUnmount() {
    this.$root.$off();
  },

  
};
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}

.select-filter {
  max-width: 350px;

  .v-input {
    height: 36px;
  }
}


.grid-layout{
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(450px, 2fr);
  column-gap: 15px;
  row-gap: 15px;
  max-width: 3072px;
}

@media (min-width: 1440px) {
    .grid-layout{
      grid-template-columns: repeat(4, 1fr);
      .thumbnail{
        max-height: 220px !important;
      }
    }
}
@media (min-width: 1800px) {
    .grid-layout{
      grid-template-columns: repeat(5, 1fr);
      .thumbnail{
        max-height: 230px !important;
      }
    }
}
@media (min-width: 2160px) {
    .grid-layout{
      grid-template-columns: repeat(6, 1fr);
      .thumbnail{
        max-height: 240px !important;
      }
    }
}
@media (min-width: 4320px) {
    .grid-layout{
      grid-template-columns: repeat(6, 1fr);
      .thumbnail{
        max-height: 281px !important;
      }
    }
}


</style>
