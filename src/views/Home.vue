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
import { followMixin, helperMixin, videosMixin } from "@/mixins";

export default {
  name: "Home",
  mixins: [followMixin, helperMixin, videosMixin],
  components: {
    VideoCard,
    InfiniteLoading,
  },
  data: () => ({
    options: [
      { name: "YouTube Hosted", value: "external" },
      { name: "BYODA Hosted", value: "published" },
    ],
  
  }),
  methods: {
   
    dateFormatter(date) {
      return moment(date).fromNow();
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
  grid-auto-rows: minmax(350px, 2fr);
  column-gap: 15px;
  row-gap: 15px;
  max-width: 3072px;
  .thumbnail{
        max-height: 220px !important;
  }
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
