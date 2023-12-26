<template>
  <div id="watch" ref="watch">
    <v-container fluid >
      <v-row>
        <v-alert prominent class="mx-auto" type="error" v-if="errored">
          <v-row align="center">
            <v-col class="grow">
              <div class="title">Error!</div>
              <div>
                Something went wrong, but don’t fret — let’s give it another
                shot.
              </div>
            </v-col>
            <v-col class="shrink">
              <v-btn @click="actions">Take action</v-btn>
            </v-col>
          </v-row>
        </v-alert>
        <v-col cols="11" class="mx-auto">
          <v-row>
            <v-col cols="12">
              <v-skeleton-loader
                type="card-avatar, article, actions"
                tile
                large
              >
                <div style="width: fit-content;">
                  <v-responsive :max-width="1120">
                    <video-player :options="getVideoOptions" :key-id="key_id" :content-token="content_token" />
                    <v-card flat tile class="card">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex align-center mt-3">
                            <v-list-item-avatar>
                                <v-img
                                  v-if="asset.creator_thumbnail"
                                  class="elevation-6"
                                  :src="asset.creator_thumbnail"
                            
                                ></v-img>
                                <v-avatar v-else color="red">
                                  <span class="white--text headline ">
                                    {{ asset.creator.split('')[0].toUpperCase() }}</span
                                  >
                                </v-avatar>
                            </v-list-item-avatar>
                            <v-card-title class="pl-0 pb-0 pt-0 font-weight-bold">
                              {{
                                asset.title
                              }}
                            </v-card-title>
                              <v-btn rounded outlined @click="followChannel" v-if="$store.getters.isAuthenticated">
                                <p class="mb-0" v-if="followedAccounts && followedAccounts.includes(asset.origin) ">
                                    Followed
                                </p>
                                <p class="mb-0" v-else>
                                  Follow
                                </p>
                              </v-btn>
                        </div>
                        <div v-if="asset.ingest_status === EXTERNAL" cols="1" class="pt-2">
                          <v-img src="~@/assets/YouTube_icon.png" height="50" width="50" ></v-img>
                        </div>
                      </div>
                      <!-- <div
                        class="d-flex flex-wrap justify-space-between"
                        id="btns"
                      >
                        <v-card-subtitle
                          class="pl-0 pt-0 pb-0 subtitle-1"
                          style="line-height: 2.4em;"
                        >
                          {{ video.views }} views<v-icon>mdi-circle-small</v-icon
                          >{{ dateFormatter(video.createdAt) }}
                        </v-card-subtitle>
                        <v-card-actions class="pt-0 pl-0">
                          <v-btn text @click="createFeeling('like')"
                            ><v-icon
                              :class="
                                `pr-2${
                                  feeling !== 'like'
                                    ? ' grey--text text--darken-1'
                                    : ''
                                }`
                              "
                              >mdi-thumb-up</v-icon
                            >{{ video.likes }}</v-btn
                          >
  
                          <v-btn text @click="createFeeling('dislike')"
                            ><v-icon
                              :class="
                                `pr-2${
                                  feeling !== 'dislike'
                                    ? ' grey--text text--darken-1'
                                    : ''
                                }`
                              "
                              >mdi-thumb-down</v-icon
                            >
                            {{ video.dislikes }}</v-btn
                          >
                          <v-btn
                            :href="`${url}/uploads/videos/${video.url}`"
                            text
                            class="grey--text text--darken-1"
                            ><v-icon>mdi-download</v-icon> Download</v-btn
                          >
                        </v-card-actions>
                      </div> -->
                    </v-card>
                    <div v-if="asset.contents " class="pa-3 mt-2" style="background-color: #e5e5e5; border-radius: 5px;">
                      <p class="black--text">
                        {{ asset.contents }}
                      </p>
                    </div>
                  </v-responsive>

                  <!-- <v-row class="justify-space-between">
                    <v-col cols="12" sm="6" md="5" lg="5">
                      <v-card class="transparent" flat>
                        <v-list-item three-line>
                          <v-list-item-avatar
                            v-if="typeof video.userId !== 'undefined'"
                            size="50"
                          >
                            <img
                              v-if="video.userId.photoUrl !== 'no-photo.jpg'"
                              :src="
                                `${getUrl}/uploads/avatars/${video.userId.photoUrl}`
                              "
                              :alt="`${video.userId.channelName} avatar`"
                            />
                            <v-avatar v-else color="red">
                              <span class="white--text headline ">
                                {{
                                  video.userId.channelName
                                    .split('')[0]
                                    .toUpperCase()
                                }}</span
                              >
                            </v-avatar>
                          </v-list-item-avatar>
                          <v-list-item-content
                            v-if="video.userId"
                            class="align-self-auto"
                          >
                            <v-list-item-title
                              class="font-weight-medium mb-1"
                              >{{ video.userId.channelName }}</v-list-item-title
                            >
                            <v-list-item-subtitle
                              >{{ video.userId.subscribers }} subscribers
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="4">
                      <div
                        class="d-flex justify-end align-center"
                        v-if="typeof video.userId !== 'undefined'"
                      >
                        <v-btn
                          v-if="
                            currentUser && video.userId._id !== currentUser._id
                          "
                          :class="[
                            { 'red white--text': !subscribed },
                            {
                              'grey grey--text lighten-3 text--darken-3': subscribed
                            },
                            'mt-6'
                          ]"
                          tile
                          large
                          depressed
                          :loading="subscribeLoading"
                          @click="subscribe"
                          >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
                        >

                        <v-btn
                          v-else-if="showSubBtn"
                          :class="[
                            { 'red white--text': !subscribed },
                            {
                              'grey grey--text lighten-3 text--darken-3': subscribed
                            },
                            'mt-6'
                          ]"
                          tile
                          large
                          depressed
                          :loading="subscribeLoading"
                          @click="subscribe"
                          >{{ !subscribed ? 'subscribe' : 'subscribed' }}</v-btn
                        >
                      </div>
                    </v-col>
                    <v-col class="pl-11" offset="1" cols="11" md="11">
                      <p>
                        {{
                          truncate
                            ? truncateText(video.description, 150)
                            : video.description
                        }}
                      </p>
                      <v-btn text @click="show" class="remove-hover-bg"
                        >Show More</v-btn
                      >
                    </v-col>
                  </v-row> -->
                </div>
              </v-skeleton-loader>

              <!-- <v-row>
                <v-col v-if="video && video.status === 'public'">
                  <p class="mb-0">{{ video.comments }} Comments</p>

                  <AddComment
                    @videoCommentLength="video.comments++"
                    :videoId="video._id"
                  />
                  <CommentList
                    @videoCommentLength="video.comments--"
                    :videoId="video._id"
                  />
                </v-col>
              </v-row> -->
            </v-col>

            <!-- <v-col cols="12" sm="12" md="4" lg="4">
              <hr class="grey--text" />
              <h4 class="mb-3 mt-3">Up next</h4>
              <div
                v-for="(video, i) in loading ? 12 : videos"
                :key="i"
                class="mb-5"
              >
                <v-skeleton-loader
                  class="mx-auto"
                  type="list-item-avatar-three-line"
                  :loading="loading"
                  tile
                  large
                >
                  <v-card
                    class="card"
                    tile
                    flat
                    v-if="!loading"
                    :to="`/watch/${video._id}`"
                  >
                    <v-row no-gutters>
                      <v-col class="mx-auto" cols="12" sm="12" md="5" lg="5">
                        <v-img
                          class="align-center"
                          height="110"
                          :src="
                            `${url}/uploads/thumbnails/${video.thumbnailUrl}`
                          "
                        >
                        </v-img>
                      </v-col>
                      <v-col>
                        <div class="ml-2">
                          <v-card-title
                            class="pl-2 pt-0 subtitle-1 font-weight-bold"
                            style="line-height: 1"
                          >
                            {{ video.title }}
                          </v-card-title>

                          <v-card-subtitle
                            class="pl-2 pt-2 pb-0"
                            style="line-height: 1"
                          >
                            {{ video.userId.channelName }}<br />
                            {{ video.views }} views<v-icon
                              >mdi-circle-small</v-icon
                            >
                            {{ dateFormatter(video.createdAt) }}
                          </v-card-subtitle>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-skeleton-loader>
              </div>
              <infinite-loading :identifier="infiniteId" @infinite="getVideos">
                <div slot="spinner">
                  <v-progress-circular
                    indeterminate
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
            </v-col> -->
          </v-row>
        </v-col>
      </v-row>
   
    </v-container>
    <signin-modal
      :openModal="signinDialog"
      :details="details"
      @closeModal="signinDialog = false"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
// import InfiniteLoading from 'vue-infinite-loading'
import 'video.js/dist/video-js.css';
import VideoService from '@/services/VideoService'
import SubscriptionService from '@/services/SubscriptionService'
import FeelingService from '@/services/FeelingService'
// import HistoryService from '@/services/HistoryService'

import SigninModal from '@/components/SigninModal'
// import AddComment from '@/components/comments/AddComment'
// import CommentList from '@/components/comments/CommentList'
import VideoPlayer from '@/components/VideoPlayer.vue'
import 'videojs-youtube';
import {followMixin} from '@/mixins/follow.js'


export default {
  mixins:[followMixin],
  data: () => ({
    loading: false,
    loaded: false,
    errored: false,
    videoLoading: true,
    subscribed: false,
    subscribeLoading: false,
    showSubBtn: true,
    feeling: '',
    video: {},
    EXTERNAL: 'external',
    videoId: '',
    videos: [],
    page: 1,
    infiniteId: +new Date(),
    truncate: true,
    url: process.env.VUE_APP_URL,
    signinDialog: false,
    details: {},
    service_id : process.env.VUE_APP_BYOTUBE_SERVICE_ID,
    initialState : {
        auth_token: typeof window !== "undefined" ? window.localStorage.getItem('token') : null,
        domain: typeof window !== "undefined" ? window.localStorage.getItem('domain') : null,
        isAuthenticated: null,
        user: null
    },
    asset:{},
    videoOptions: {},
    key_id:'',
    content_token:'',
    followedAccounts:null,
   
  }),
  computed: {
    ...mapGetters(['currentUser', 'getUrl', 'isAuthenticated']),
    getVideoOptions(){
      return this.videoOptions
    }
  },
  methods: {
    async getVideo() {  
      let assetData = typeof window !== "undefined" ? window.localStorage.getItem('watch') : null
      if(!assetData) return
      assetData = JSON.parse(assetData)

      this.asset = {...assetData,  video_thumbnail: assetData.video_thumbnails[assetData.video_thumbnails.length-1],}

      this.key_id = assetData.key_id
      this.content_token = assetData.content_token

      if (this.key_id) {
          this.asset.asset_url += `?key_id=${this.key_id}`
      }


      this.type = 'application/dash+xml'
      if (this.asset.ingest_status == 'external') {
        this.type = 'video/youtube'
      }

      this.videoOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        width: '1120',
        height: '630',

        poster: this.asset.video_thumbnail.url,
        sources: [
          {
            src:
                this.asset.asset_url,
              type: this.type
          }
        ],
      }

     

      if (this.asset.ingest_status == 'external') {
        this.videoOptions['techOrder'] = ['youtube'];
        // videoJsOptions['autoplay'] = true;
      }

    },

    async followChannel(){
      const {data} = await this.follow(this.asset.creator, this.asset.origin, this.service_id, this.asset.created_timestamp)
      if(data){  
        this.setFollowed(this.asset.origin)
        this.followedAccounts = JSON.parse(window.localStorage.getItem('followedAccounts')) 
     }
    },
    async checkSubscription(id) {
      if (!this.isAuthenticated) return

      this.loading = true
      const sub = await SubscriptionService.checkSubscription({ channelId: id })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })

      if (!sub) return

      if (!sub.data.data._id) this.subscribed = false
      else this.subscribed = true
    },
    async checkFeeling(id) {
      if (!this.isAuthenticated) return

      this.loading = true
      const feeling = await FeelingService.checkFeeling({ videoId: id })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })

      if (!feeling) return

      if (feeling.data.data.feeling === 'like') this.feeling = 'like'
      else if (feeling.data.data.feeling === 'dislike') this.feeling = 'dislike'
    },
  
    async createFeeling(type) {
      if (!this.isAuthenticated) {
        this.signinDialog = true
        this.details = {
          title:
            type === 'like' ? 'Like this video?' : "Don't like this video?",
          text: 'Sign in to make your opinion count.'
        }
        return
      }
      switch (true) {
        case type === 'like' && this.feeling === '':
          this.feeling = 'like'
          this.video.likes++
          // console.log('new like')
          break
        case type === 'like' && this.feeling === type:
          this.feeling = ''
          this.video.likes--
          // console.log('remove like')
          break
        case type === 'like' && this.feeling === 'dislike':
          this.feeling = 'like'
          this.video.dislikes--
          this.video.likes++
          // console.log('change to like')
          break
        case type === 'dislike' && this.feeling === '':
          this.feeling = 'dislike'
          this.video.dislikes++
          // console.log('new dislike')
          break
        case type === 'dislike' && this.feeling === type:
          this.feeling = ''
          this.video.dislikes--
          // console.log('remove dislike')
          break
        case type === 'dislike' && this.feeling === 'like':
          this.feeling = 'dislike'
          this.video.likes--
          this.video.dislikes++
        // console.log('change to dislike')
      }

      const feeling = await FeelingService.createFeeling({
        videoId: this.video._id,
        type
      }).catch((err) => {
        console.log(err)
      })

      if (!feeling) return
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
        channelId: this.video.userId._id
      })
        .catch((err) => console.log(err))
        .finally(() => {
          this.subscribeLoading = false
        })

      if (!sub) return

      if (!sub.data.data._id) {
        this.subscribed = false
        this.video.userId.subscribers--
      } else {
        this.subscribed = true
        this.video.userId.subscribers++
      }
    },
    async updateViews(id) {
      const views = await VideoService.updateViews(id).catch((err) => {
        console.log(err)
      })
      if (!views) return

      this.video.views++
    },
    play(e) {
      console.log(e)
    },
    actions() {
      this.getVideo()
    },
    show(event) {
      if (event.target.innerText === 'SHOW MORE') {
        this.truncate = false
        event.target.innerText = 'SHOW LESS'
      } else {
        this.truncate = true
        event.target.innerText = 'SHOW MORE'
      }
    },
    truncateText(string = '', num) {
      if (string.length <= num) {
        return string
      }
      return string.slice(0, num)
    },
    dateFormatter(date) {
      return moment(date).fromNow()
    }
  },
  components: {
    // AddComment,
    // CommentList,
    SigninModal,
    // InfiniteLoading,
    VideoPlayer,
},
  created(){
  this.getVideo()
  },
  mounted() {
    this.followedAccounts = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem('followedAccounts')) : null
    // if (this.isAuthenticated) this.updateViews(this.$route.params.id)
  },
  // beforeRouteUpdate(to, from, next) {
  //   this.page = 1
  //   ;(this.loading = false), (this.loaded = false), (this.videos = [])
  //   this.infiniteId += 1
  //   this.getVideo(to.params.id)
  //   next()
  // }
}
</script>

<style lang="scss">
video {
  max-width: 100%;
}

.grey-color {
  color: #7f7f7f !important;
}

#btns {
  border-bottom: 1px solid #e0d8d8;
}

button.v-btn.remove-hover-bg {
  background-color: initial !important;
  &:hover {
    background-color: #f9f9f9;
  }
}
</style>
