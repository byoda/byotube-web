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

      <main>
        <!-- <div class="d-flex justify-space-between">
          <h3 class="headline font-weight-medium">
            {{
              $store.getters.isAuthenticated
                ? "From your network"
                : "Recommended"
            }}
          </h3>
        </div> -->
        <div class="text-center">
          <v-progress-circular indeterminate v-if="loadAllVideos" color="red"></v-progress-circular>
        </div>
        <div v-for="(section, sectionIndex) in sections" :key="sectionIndex">
          <div v-if="section.videos.length">
            <h2 class="text-h1 section-title secondary--text font-weight-medium">
              {{ section.title }}
            </h2>
            <div class="grid-layout">
              <div v-for="(video, i) in section.videos" :key="i" class="py-6" @click="getItem(video)"
                :followed-accounts="followedAccounts" style="position: relative;">
                <!-- <v-skeleton-loader style="" type="card-avatar" :loading="section.loading"> -->
                  <video-card :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                    @follow="followChannel(video.node, video.origin)"
                    style="position: absolute; width: 100%;"></video-card>
                <!-- </v-skeleton-loader> -->
              </div>
            </div>
            <div v-if="section.has_next_page" class="mt-10">
              <hr>
              <div class="text-center show-more-btn">
                <v-btn :loading="section.loading" elevation="0" rounded
                  class="auth-btn show-more-btn font-weight-normal light-gray--text mt-n8"
                  @click="mapSegmentedVideos(section, sectionIndex, 24)">
                  Show More <v-icon left size="26" class="ml-2 font-weight-light">mdi-chevron-down</v-icon>
                </v-btn>
              </div>
            </div>
            <!-- <div class="text-center" v-else-if="!section.has_next_page">
              <p>No more videos</p>
            </div> -->
          </div>
          <!-- <div class="text-center" v-if="videos.length === 0 && !loading">
            <p>No videos yet</p>
          </div> -->
          <!-- <div cols="12" sm="12" md="12" lg="12">
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
          </div> -->
        </div>
        <!-- <v-col class="text-center" v-if="!has_next_page">
          <p>No more videos</p>
        </v-col> -->
      </main>
    </v-container>
  </div>
</template>

<script>
// import InfiniteLoading from "vue-infinite-loading";
import moment from "moment";
import VideoCard from "@/components/VideoCard";
import { followMixin, helperMixin, videosMixin } from "@/mixins";

export default {
  name: "Home",
  mixins: [followMixin, helperMixin, videosMixin],
  components: {
    VideoCard,
    // InfiniteLoading,
  },
  data: () => ({
    options: [
      { name: "YouTube Hosted", value: "external" },
      { name: "BYODA Hosted", value: "published" },
    ],
    sections: [
      {
        title: "Recent Uploads",
        key:'recent_uploads',
        loading: true,
        videos: [],
        after: null,
        has_next_page: null
      },
      {
        title: "Recommended",
        key:"Recommended",
        loading: true,
        videos: [],
        after: null,
        has_next_page: null
      },
      {
        title: "Entertainment",
        key:'entertainment',
        loading: true,
        videos: [],
        after: null,
        has_next_page: null
      },
      {
        title: "Education",
        key:'education',
        loading: true,
        videos: [],
        after: null,
        has_next_page: null
      },
    ],
    loadAllVideos: false,
  }),
  methods: {

    dateFormatter(date) {
      return moment(date).fromNow();
    },

    getAllSegmentedVideos() {
      this.loadAllVideos = true
      this.sections?.forEach(async (section, index) => {
        await this.mapSegmentedVideos(section, index)
        this.loadAllVideos = false
      })


    },

    async mapSegmentedVideos(section, index, first) {
      section.loading = true
      const videosData = await this.getSegmentedVideos(section?.key, section?.after, first ? first : 8)
      section.videos.push(...videosData?.edges)
      section.has_next_page = videosData?.page_info?.has_next_page;
      if (section.has_next_page) {
        section.after = videosData?.page_info.end_cursor;
      }
      section.loading = false
      this.sections[index] = section
    },

    emptySectionVideos(){
      this.sections.forEach(section=>{
        section.videos = []
        section.after = null
        section.has_next_page = null
      })
    }


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
      // this.getVideos();
      this.emptySectionVideos()
      this.getAllSegmentedVideos()
    });

    this.getAllSegmentedVideos()
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

.section-title::after{
  content: "";
  display: block;
    height: 4px;
    width: 40px;
    background-color: #00579d;
}

.show-more-btn {
  button {
    border: 1px solid #9a9a9a;
    text-transform: capitalize;
    background-color: red;
    padding-inline: 80px !important;

    span {
      font-weight: 500 !important;
    }

    i {
      padding-top: 2px;
    }
  }
}


.grid-layout {
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(350px, 2fr);
  column-gap: 15px;
  row-gap: 15px;
  max-width: 3072px;

  .thumbnail {
    max-height: 220px !important;
  }
}

@media (max-width: 425px) {
  .grid-layout {
    grid-template-columns: repeat(1, 1fr);

    .thumbnail {
      max-height: 220px !important;
    }
  }
}

@media (min-width: 1440px) {
  .grid-layout {
    grid-template-columns: repeat(4, 1fr);

    .thumbnail {
      max-height: 220px !important;
    }
  }
}

@media (min-width: 1800px) {
  .grid-layout {
    grid-template-columns: repeat(5, 1fr);

    .thumbnail {
      max-height: 230px !important;
    }
  }
}

@media (min-width: 2160px) {
  .grid-layout {
    grid-template-columns: repeat(6, 1fr);

    .thumbnail {
      max-height: 240px !important;
    }
  }
}

@media (min-width: 4320px) {
  .grid-layout {
    grid-template-columns: repeat(6, 1fr);

    .thumbnail {
      max-height: 281px !important;
    }
  }
}
</style>
