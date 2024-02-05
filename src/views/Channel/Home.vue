<template>
  <div id="channel-home">
    <div class="mt-2" :style="{ 'padding-inline': $vuetify.breakpoint.mdAndUp ? '65px' : '10px' }">
      <v-parallax height="230" style="border-radius: 15px;"
        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-parallax>
    </div>
    <v-container class="py-0">
      <div class="nav-bgcolor">
        <div id="channel-header">
          <v-row class="justify-space-between">

            <v-col cols="12" :style="{ 'padding-inline': $vuetify.breakpoint.mdAndUp ? '65px' : '10px' }">
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
        <v-card flat class="transparent" height="100%" :style="{ 'padding-inline': $vuetify.breakpoint.mdAndUp ? '65px' : '10px' }">
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
                  <!-- <v-sheet class="mx-auto"> -->
                    <video-card :card="{ maxWidth: 370, maxHeight:238 }" :video="video" :channel="video.origin"
                     ></video-card>
                  <!-- <v-slide-group class="pa-4" multiple show-arrows>
                    <v-slide-item>
                      <v-skeleton-loader type="card-avatar" :loading="loading" width="250px" class="mr-1">
                      </v-skeleton-loader>
                    </v-slide-item>
                  </v-slide-group> -->
                </v-card>
              </v-tab-item>
            </v-tabs-items>
        </v-card>
      </div>
    </v-container>
    <signin-modal :openModal="signinDialog" :details="details" @closeModal="signinDialog = false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import UserService from '@/services/UserService'
import VideoService from '@/services/VideoService'
import SubscriptionService from '@/services/SubscriptionService'

import VideoCard from '@/components/VideoCard'
import SigninModal from '@/components/SigninModal'

export default {
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
    video: {
      "created_timestamp": "2024-02-03T06:24:52.356119Z",
      "asset_id": "655647c1-4a6f-4f50-ad9b-6b585e1ac861",
      "asset_type": "video",
      "asset_url": "https://www.youtube.com/watch?v=H_7aLJTaKlY",
      "asset_merkle_root_hash": null,
      "video_thumbnails": [
        {
          "thumbnail_id": "ed821fe5-9b12-47f1-9199-d6ac9e6bd866",
          "url": "https://i.ytimg.com/vi_webp/H_7aLJTaKlY/maxresdefault.webp",
          "width": 0,
          "height": 0,
          "preference": "",
          "size": "0x0"
        },
        {
          "thumbnail_id": "f7d44e78-dd1a-4fb9-99a6-07fd21418ab5",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/default.jpg",
          "width": 120,
          "height": 90,
          "preference": "-13",
          "size": "120x90"
        },
        {
          "thumbnail_id": "e57dd2ae-ac58-49b1-9a18-4c8a258a8a99",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/mqdefault.jpg",
          "width": 320,
          "height": 180,
          "preference": "-11",
          "size": "320x180"
        },
        {
          "thumbnail_id": "ca0612e6-bb06-4a48-81cd-cc16c6cd9665",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCoBoWmYiimesIYZ11lwCi3Rybq7Q",
          "width": 168,
          "height": 94,
          "preference": "-7",
          "size": "168x94"
        },
        {
          "thumbnail_id": "50a9c2c0-5919-44bb-86db-f3b37f40ecbb",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/hqdefault.jpg?sqp=-oaymwEbCMQBEG5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBJmR_s3Zz56v5wTlAp1gS_bF-nBg",
          "width": 196,
          "height": 110,
          "preference": "-7",
          "size": "196x110"
        },
        {
          "thumbnail_id": "56daa9f7-4f2c-462a-b62b-dc81681740f1",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCxH62L6mzikouNibumkeYSfKAkPg",
          "width": 246,
          "height": 138,
          "preference": "-7",
          "size": "246x138"
        },
        {
          "thumbnail_id": "c0ef8a12-dd58-4e27-80f2-07722d94dddf",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBogml102sg5za22Ci7JnYHG7Teig",
          "width": 336,
          "height": 188,
          "preference": "-7",
          "size": "336x188"
        },
        {
          "thumbnail_id": "65b00110-b3f9-4662-abfa-6e9a9d471d1b",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/hqdefault.jpg",
          "width": 480,
          "height": 360,
          "preference": "-7",
          "size": "480x360"
        },
        {
          "thumbnail_id": "fac54c38-da64-451b-8215-e748ad7d4280",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/sddefault.jpg",
          "width": 640,
          "height": 480,
          "preference": "-5",
          "size": "640x480"
        },
        {
          "thumbnail_id": "acf369c6-dceb-431d-be23-df9549cb6641",
          "url": "https://i.ytimg.com/vi/H_7aLJTaKlY/maxresdefault.jpg",
          "width": 1920,
          "height": 1080,
          "preference": "-1",
          "size": "1920x1080"
        }
      ],
      "video_chapters": [],
      "locale": null,
      "creator": "GMHikaru",
      "creator_thumbnail": "https://yt3.googleusercontent.com/CLZYpQiar2z6iwlTK3pGtxfd9gqarP8tb7IGg-eHbXdAiaMZJu2w8-LvRo2dywj0ZSStjGUyxw=s900-c-k-c0x00ffffff-no-rj",
      "published_timestamp": "2024-02-03T00:00:00Z",
      "content_warnings": [],
      "claims": [],
      "copyright_years": [],
      "publisher": "YouTube",
      "publisher_asset_id": "H_7aLJTaKlY",
      "title": "Hans Banned From The Saint Louis Chess Club",
      "contents": "Hikaru reacts to the news that the Saint Louis Chess Club has not extended an invitation Hans back to it's 2024 events as well as cheating drama from CCT\n👍LIVE MOST WEEKDAYS ON KICK ►https://www.kick.com/gmhikaru\n♟️ LEARN CHESS  & PLAY WITH ME ► https://go.chess.com/hikaru \n🎁 GIVE 💎 CHESS ► https://www.chess.com/membership/gift?ref_id=15448422\n🎬 CLIPS CHANNEL ► https://www.youtube.com/c/GMHikaruClips?sub_confirmation=1\n🎞️ MORE GMHIKARU ► https://www.youtube.com/c/moregmhikaru?sub_confirmation=1\n💜 TWITCH ► https://www.twitch.tv/gmhikaru\n📸 INSTAGRAM ► https://www.instagram.com/gmhikaru/\n🐦 TWITTER ► https://twitter.com/gmhikaru\n✨ TIKTOK ► https://www.tiktok.com/@gmhikaru\n💛 DISCORD ► https://discord.com/invite/aeaqK6g\n💙 FACEBOOK  ►  https://facebook.com/GMHikaru\n💚 SUPPORT  ► https://streamlabs.com/gmhikaru\n🤣 REDDIT ► https://www.reddit.com/r/HikaruNakamura/\n━━━━━━━━━━━━━\n🎥 Edit and 🎨 Thumbnail ► Jaron  https://twitter.com/jaroniscaring\n👌Channel Management  ► Team Hikaru\n📧 Global Business contact: TeamGMHikaru@gmail.com \n📭Chinese Brand Business contact: gmhikaru_ydads@163.com\n\n#gmhikaru #chess #hansniemann",
      "keywords": [],
      "annotations": [],
      "categories": [
        "Gaming"
      ],
      "duration": 487,
      "channel_id": null,
      "ingest_status": "external",
      "screen_orientation_horizontal": true,
      "origin": "33b7f7c4-2a1c-4165-999b-9bea2e64a1c5"
    }
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser'])
  },
  components: {
    VideoCard,
    SigninModal
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
      this.getVideos()

      this.checkSubscription(this.channel._id)
      // console.log(channel)
    },
    async getVideos() {
      // this.getChannel()
      this.loading = true

      const videos = await VideoService.getAll('public', {
        userId: this.channel._id
      })
        .catch((err) => {
          console.log(err)
          this.errored = true
        })
        .finally(() => (this.loading = false))

      if (typeof videos === 'undefined') return

      this.videos = videos.data
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
  mounted() {
    // this.getChannel(this.$route.params.id)
  },
  // beforeRouteUpdate(to, from, next) {
  //   this.getChannel(to.params.id)
  //   next()
  // }
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
