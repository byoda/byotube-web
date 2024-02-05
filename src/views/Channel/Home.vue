<template>
  <div id="channel-home" :style="{ 'padding-inline': $vuetify.breakpoint.mdAndUp ? '65px' : '10px' }">
    <div class="mt-2">
      <v-parallax height="230" style="border-radius: 15px;"
        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-parallax>
    </div>
    <v-container class="py-0">
      <div class="nav-bgcolor">
        <div id="channel-header">
          <v-row class="justify-space-between">

            <v-col cols="12">
              <v-skeleton-loader type="list-item-avatar-two-line" :loading="loading" class="mr-1">
                <div>
                  <v-row class="d-flex">
                    <v-col cols="12" md="2" size="160">
                      <v-img class="circle" height="160" width="160"
                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>

                      <!-- <v-avatar v-else color="red" size="60">
                        <span class="white--text headline ">
                          {{
                            channel.channelName.split('')[0].toUpperCase()
                          }}</span
                        >
                      </v-avatar> -->
                    </v-col>
                    <v-col cols="12" md="10" class="align-self-auto">
                      <h1 class="channel-name">Junaid Jahan</h1>
                      <p class="channel-subtitle mb-0">
                        @junaidjahan <span> . </span> <span>3.7M subscribers</span> <span> . </span> <span>182
                          videos</span>
                      </p>
                      <p class="channel-subtitle py-2 mb-0">
                        I am a frontend focused software engineer having experience in Vue Js
                      </p>
                      <v-btn height="36" width="95" class="text-capitalize px-2 font-weight-medium text-caption" dark
                        rounded>
                        <p class="subscribe-btn mb-0 px-2">
                          Subscribe
                        </p>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
        <div v-if="sections.videos.length" class="mt-8">
          <h2 class="text-h1 section-title secondary--text font-weight-medium">
            {{ sections.title }}
          </h2>
          <div class="grid-layout">
            <div v-for="(video, i) in sections.videos" :key="i" class="py-6" @click="getItem(video)"
              :followed-accounts="followedAccounts" style="position: relative;">
              <!-- <v-skeleton-loader style="" type="card-avatar" :loading="sections.loading"> -->
              <video-card :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                @follow="followChannel(video.node, video.origin)" style="position: absolute; width: 100%;"></video-card>
              <!-- </v-skeleton-loader> -->
            </div>
          </div>
          <div v-if="sections.has_next_page" class="mt-10">
            <hr>
            <div class="text-center show-more-btn">
              <v-btn :loading="sections.loading" elevation="0" rounded
                class="auth-btn show-more-btn font-weight-normal light-gray--text mt-n8"
                @click="mapSegmentedVideos(section, sectionIndex, 24)">
                Show More <v-icon left size="26" class="ml-2 font-weight-light">mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <infinite-loading @infinite="getChannelVideos($event)">
              <div slot="spinner">
                <v-progress-circular indeterminate :loading="sections.loading" color="red"></v-progress-circular>
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
        <!-- <v-card flat class="transparent" height="100%" :style="{ 'padding-inline': $vuetify.breakpoint.mdAndUp ? '65px' : '10px' }">
          <v-row>
            <v-col cols="12" md="7" class="tabs">
              <v-tabs v-model="tab" background-color="transparent" show-arrows centered center-active>
                <v-tab v-for="(item, i) in items" :key="i" class="mr-2 px-1">
                  <p class="mb-0 text-subtitle-1 text-capitalize">
                    {{ item }}
                  </p>
                </v-tab>
              </v-tabs>
            </v-col>

          </v-row>

            <v-tabs-items v-model="tab" class="transparent">
              <v-tab-item>
                <v-card class="transparent" flat width="370">
                  <v-card-title>Uploads</v-card-title>
                    <video-card :card="{ maxWidth: 370, maxHeight:238 }" :video="video" :channel="video.origin"
                     ></video-card>
                  <v-slide-group class="pa-4" multiple show-arrows>
                    <v-slide-item>
                      <v-skeleton-loader type="card-avatar" :loading="loading" width="250px" class="mr-1">
                      </v-skeleton-loader>
                    </v-slide-item>
                  </v-slide-group>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
        </v-card> -->
      </div>
    </v-container>
    <!-- <signin-modal :openModal="signinDialog" :details="details" @closeModal="signinDialog = false" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserService from '@/services/UserService'
import SubscriptionService from '@/services/SubscriptionService'
import VideoCard from '@/components/VideoCard'
// import SigninModal from '@/components/SigninModal'
import { videosMixin } from "@/mixins";
import InfiniteLoading from "vue-infinite-loading";

export default {
  mixins: [videosMixin],
  data: () => ({
    tab: null,
    loading: false,
    errored: false,
    subscribed: false,
    subscribeLoading: false,
    showSubBtn: true,
    url: process.env.VUE_APP_URL,
    items: ['Home', 'Videos', 'Playlists', 'Community', 'Channels', 'about'],
    videos: {},
    channel: {},
    signinDialog: false,
    details: {},
    sections:
    {
      title: "Videos",
      key: '',
      loading: true,
      videos: [],
      after: null,
      has_next_page: null
    },
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser'])
  },
  components: {
    VideoCard,
    InfiniteLoading
  },
  methods: {
    async getChannel(id) {
      // console.log(this.$route.params.id)
      this.loading = true
      this.errored = false

      const channel = await UserService.getById(id)
        .catch((err) => {
          this.errored = true
          console.log(err)
          this.$router.push('/')
        })
        .finally(() => (this.loading = false))

      if (!channel) return
      this.channel = channel.data.data
      // console.log(channel)
      if (this.currentUser && this.currentUser._id === this.channel._id) {
        this.showSubBtn = false
      } else {
        this.showSubBtn = true
      }
      // this.getVideos()

      this.checkSubscription(this.channel._id)
      // console.log(channel)
    },
    async getChannelVideos($state) {
      const data = await this.getSegmentedVideos('CaspianReport', this.sections.after, 9)
      this.sections.videos.push(...data?.edges)
      this.sections.after = data?.page_info?.end_cursor
      $state?.loaded()
    },
    async checkSubscription(id) {
      if (!this.currentUser) return
      this.loading = true
      const sub = await SubscriptionService.checkSubscription({ channelId: id })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      // console.log(sub.data.data)
      if (!sub) return

      if (!sub.data.data._id) this.subscribed = false
      else this.subscribed = true
    },
    async subscribe() {
      if (!this.isAuthenticated) {
        this.signinDialog = true
        this.details = {
          title: 'Want to subscribe to this channel?',
          text: 'Sign in to subscribe to this channel.'
        }
        return
      }
      this.subscribeLoading = true
      const sub = await SubscriptionService.createSubscription({
        channelId: this.channel._id
      })
        .catch((err) => console.log(err))
        .finally(() => {
          this.subscribeLoading = false
        })

      if (!sub) return

      if (!sub.data.data._id) {
        this.subscribed = false
        this.channel.subscribers--
      } else {
        this.subscribed = true
        this.channel.subscribers++
      }

      // console.log(this.subscribed)
    }
  },
  async mounted() {
    const queryFilter = {
      filter:{
        creator:{
          eq:this.$route.query.creator
        }
      },
      remote_member_id:this.$route.params.id
    }
    const { data } = await this.getChannelData(queryFilter)
    console.log("Data", data);
    // this.getVideos()
  }

}
</script>

<style lang="scss">
.nav-bgcolor {
  background: #f9f9f9;
}

.card {
  background: #f9f9f9 !important;
}

.v-tab {
  margin-right: 4em;
}

#channel-home .v-list-item--link:before {
  background-color: transparent;
}

.circle {
  border-radius: 100px;
}

.channel-name {
  font-size: 36px;
  font-weight: 700;
}

.channel-subtitle {
  font-size: 14px;
  color: #606060
}

.subscribe-btn {
  font-weight: 600;
  font-size: 13px;
}

.tabs {
  .v-tab {
    min-width: 48px !important;
  }

  .v-tabs--centered>.v-tabs-bar .v-tabs-slider-wrapper+* {
    margin-left: 0px;
  }

}
</style>
