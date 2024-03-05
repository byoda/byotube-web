<template>
  <div id="watch" ref="watch" :key="pageKey">
    <v-container fluid>
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
        <v-col offset-md="1" cols="12" md="7">
          <v-row>
            <v-col cols="12">
              <v-skeleton-loader :loading="videoLoading" type="card-avatar, article, actions" tile large>
                <div style="width: 100%;">
                  <v-responsive>
                    <div style="border-radius: 10px !important; overflow: hidden; position: relative;">
                      <div v-if="videoNotfound" class="d-flex justify-center video-not-available">
                        <v-icon class="text-white pr-3" size="50">
                          mdi-information
                        </v-icon>
                        <p class="text-h3 text-white ">Video no longer available!</p>
                      </div>
                      <video-player style="min-height: 480px; width: 100%;" ref="videoJs" :options='getVideoOptions'
                        :key-id="key_id" :content-token="content_token" :key="playerKey" />
                    </div>
                    <v-card flat tile class="card" v-if="!videoNotfound">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex align-center mt-3">
                          <v-card-title class="pl-0 pb-0 pt-0 font-weight-medium">
                            {{ asset?.title }}
                          </v-card-title>
                        </div>
                        <div v-if="asset?.ingest_status === EXTERNAL" cols="1" class="pt-2">
                          <img src="@/assets/YouTube_icon.png" height="50" width="50" />
                        </div>
                      </div>
                      <div class="d-flex justify-space-between align-center">
                        <div class="d-flex align-center">

                          <v-avatar class="cursor-pointer" color="red" @click="movetoChannel">
                            <v-img v-if="asset?.creator_thumbnail" class=" elevation-6"
                              :src="asset?.creator_thumbnail"></v-img>
                            <span v-else class="white--text headline ">
                              {{
    asset?.creator?.split("")[0].toUpperCase()
  }}</span>
                          </v-avatar>


                          <p class="ml-3 pb-0 pt-0 channel-name mr-4 cursor-pointer" @click="movetoChannel">
                            {{ asset?.creator }}
                          </p>
                          <BaseBtn rounded variant="outlined"
                            @click="!isAuthenticated ? openAuthDialog() : followChannel()">
                            <p class="mb-0" v-if="getFollowing &&
    getFollowing.includes(asset?.origin)
    ">
                              Followed
                            </p>
                            <p class="mb-0" v-else>
                              Follow
                            </p>
                          </BaseBtn>
                        </div>
                        <div class="d-flex align-center">
                          <v-btn-toggle density="compact" class="toggle-btn-class" dense rounded="xl" :border="true"
                            divided>
                            <v-btn icon @click="!isAuthenticated ? openAuthDialog() : likeOrDislike(LIKE)">
                              <v-icon v-if="isVideosLikedByCurrentUser" size="24">mdi-thumb-up</v-icon>
                              <v-icon v-else size="24">mdi-thumb-up-outline</v-icon>
                            </v-btn>
                            <v-btn icon @click="!isAuthenticated ? openAuthDialog() : likeOrDislike(DISLIKE)">
                              <v-icon v-if="isVideoDislikedByCurrentUser" size="24">mdi-thumb-down</v-icon>
                              <v-icon v-else size="24">mdi-thumb-down-outline</v-icon>
                            </v-btn>
                          </v-btn-toggle>
                          <BaseBtn color="#dcdcdc" rounded variant="outlined" class="ml-2 grey-background"
                            @click="openCopyUrlDialog">
                            <v-icon color="black" size="26">mdi-share-outline</v-icon>
                            <p class="mb-0 ml-1 share">
                              Share
                            </p>
                          </BaseBtn>
                          <BaseBtn icon small color="#dcdcdc" rounded variant="outlined"
                            class="ml-2 px-0 dots-button rounded-circle">
                            <v-icon color="black" size="26">mdi-dots-horizontal</v-icon>
                          </BaseBtn>
                        </div>
                      </div>
                    </v-card>
                    <div v-if="asset?.contents" class="pa-3 mt-2 grey-background"
                      style="background-color: #e5e5e5; border-radius: 5px;">
                      <!-- <p class="black--text" v-html="asset?.contents">
                      </p> -->
                      <p v-if="asset?.contents.length > 205 && !showFull">
                        {{ textEllipsis(asset?.contents, 205) }} <span v-if="asset?.contents.length > 205"
                          class="font-weight-medium cursor-pointer" @click="showFull = true">...more</span>
                      </p>
                      <p v-else>
                        {{ asset.contents }}
                      </p>
                    </div>
                  </v-responsive>
                </div>
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3" class="pt-3" tag="div">
          <BaseInfiniteScroller :items="rightPanelVideos.videos" @load="mapSegmentedVideos(rightPanelVideos, 25, $event)">
            <div v-for="(video, i) in loading ? 12 : rightPanelVideos.videos" :key="i" class="recommended-videos mb-2"
              :followed-accounts="followedAccounts" style=" height: 90px; cursor: pointer;"
              @click="replaceVideo(video); videoOptions.autoplay = 'play'">
              <v-skeleton-loader style="" max-height="90" type="list-item-avatar-three-line" :loading="loading">
                <video-card :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                  @follow="followChannel(video.node, video.origin)" style="width: 100%;" small-card />
              </v-skeleton-loader>
            </div>
          </BaseInfiniteScroller>
        </v-col>
      </v-row>
    </v-container>
    <NonAuthDialog />
    <CopyUrlDialog :url="path" />
  </div>
</template>

<script setup>
import "video.js/dist/video-js.css";
import "videojs-youtube";
import VideoCard from "@/components/VideoCard.vue";
import VideoPlayer from "@/components/VideoPlayer.vue";
import { useWatch } from "./useWatch"
import { onMounted } from "vue";
import { useFollow, useHelper, useVideo } from "@/composables";
import { useAuthStore, useCoreStore } from "@/store";
import { onUnmounted } from "vue";
import { BaseBtn, BaseCard, BaseInfiniteScroller } from "@/components/base";
import { NonAuthDialog, CopyUrlDialog } from "@/components/shared";
import { useRouter, useRoute } from "vue-router";
import { toRefs } from "vue";

const coreStore = useCoreStore()
const { isAuthenticated } = toRefs(useAuthStore())
const router = useRouter()
const route = useRoute()

const path = window.location.href

const { textEllipsis } = useHelper()
const { getFollowedChannels } = useFollow()

const {
  asset,
  videoOptions,
  key_id,
  content_token,
  assetReactions,
  EXTERNAL,
  getVideoOptions,
  LIKE,
  DISLIKE,
  isVideoDislikedByCurrentUser,
  isVideosLikedByCurrentUser,
  playerKey,
  videoLoading,
  showFull,
  videoJs,
  getFollowing,
  rightPanelVideos,
  videoNotfound,
  getVideo,
  getAssetReactionsById,
  followChannel,
  likeOrDislike,
  replaceVideo,
  addReactionAndBookmark,
  openAuthDialog,
  openCopyUrlDialog,
  mapSegmentedVideos,
  mapFollowIds
} = useWatch()

const { loading, videos, getVideos } = useVideo()

const assetId = route.query?.asset_id;
const memberId = route.query?.member_id;
const cursor = route.query?.v;

const movetoChannel = () => {
  router.push(`/channels?member_id=${memberId}&channel=${asset.value?.creator}`)
}


onMounted(async () => {
  if (!assetId && !memberId && !cursor) {
    router.push({ name: 'Home' }) // Redirect to Home if no url param
  }
  // await mapSegmentedVideos(rightPanelVideos, 25)
  coreStore.setDrawer(false)
  getFollowing.value =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("followedAccounts"))
      : null;

      if(isAuthenticated.value){
        const { data } = await getFollowedChannels()
        getFollowing.value = mapFollowIds(data.edges)
      }
  await getVideo(); // get Video from the route params
  if (isAuthenticated.value) {
    assetReactions.value = await getAssetReactionsById(assetId)
    if (assetReactions.value.length) {
      videoJs.value.player.on('loadedmetadata', () => {
        videoJs.value.player.currentTime(+assetReactions.value[0]?.node?.bookmark)
      })
    }
    if (!assetReactions.value.length) {
      await addReactionAndBookmark(asset.value)
    }
  }
 


})

onUnmounted(() => [
  coreStore.setDrawer(true)
])


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

.active-btn {
  background-color: #f2f2f2 !important;

}

.toggle-btn-class {
  .v-btn {
    background-color: #f2f2f2 !important;
    padding-inline: 30px;
  }

  .v-btn__overlay {
    background-color: #f2f2f2 !important;
  }
}

.channel-name {
  font-size: 1rem !important;
  font-weight: 600 !important;
}

.share {
  color: black;
  text-transform: capitalize;
}

.dots-button {
  background-color: #f2f2f2 !important;
  height: 37px !important;
  width: 37px !important;
}

.grey-background {
  background-color: #f2f2f2 !important;
}

.recommended-videos {
  .thumbnail {
    max-height: 90px !important;
    min-height: 90px !important;
    max-width: 168px;
    object-fit: cover;
  }
}

.video-not-available {
  position: absolute;
  width: 100%;
  top: 30%;
  z-index: 1;
}
</style>
