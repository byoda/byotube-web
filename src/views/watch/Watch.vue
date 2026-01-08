<template>
  <div id="watch" ref="watch">
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
              <v-skeleton-loader
                :loading="videoLoading"
                type="card-avatar, article, actions"
                tile
                large
              >
                <div style="width: 100%" class="light-grey-background">
                  <v-responsive>
                    <div
                      style="
                        border-radius: 10px !important;
                        overflow: hidden;
                        position: relative;
                      "
                    >
                      <div
                        v-if="videoNotfound"
                        class="d-flex justify-center video-not-available"
                      >
                        <v-icon class="text-white pr-3" size="50">
                          mdi-information
                        </v-icon>
                        <p class="text-h3 text-white">
                          Video no longer available!
                        </p>
                      </div>
                      <video-player
                        style="min-height: 480px; width: 100%"
                        ref="videoJs"
                        :options="getVideoOptions"
                        :key-id="key_id"
                        :content-token="content_token"
                        :key="playerKey"
                        :asset-id="asset?.asset_id"
                        :origin="asset?.origin"
                        :member-id="memberId"
                        :member-type="
                          !isAuthenticated
                            ? 'ANONYMOUS'
                            : isBtLiteAccount
                            ? 'btlite'
                            : 'member'
                        "
                      />
                    </div>
                    <v-card flat tile class="card mb-2" v-if="!videoNotfound">
                      <div class="d-flex justify-space-between mt-2">
                        <div class="d-flex align-center mt-3">
                          <v-card-title
                            class="pl-0 pb-0 pt-0 font-weight-medium"
                          >
                            {{ asset?.title }}
                          </v-card-title>
                        </div>
                        <div
                          v-if="asset?.ingest_status === EXTERNAL"
                          cols="1"
                          class="pt-2"
                        >
                          <img
                            src="@/assets/YouTube_icon.png"
                            height="50"
                            width="50"
                          />
                        </div>
                        <v-col
                          v-if="
                            asset?.ingest_status !== EXTERNAL && showBurstIcon
                          "
                          cols="1"
                          class="mb-n4"
                        >
                          <img
                            height="35"
                            src="@/assets/Burst_icon.png"
                            alt=""
                            srcset=""
                            class="ml-n3"
                          />
                        </v-col>
                      </div>
                      <div
                        class="d-md-flex justify-space-between align-center mt-3"
                      >
                        <div
                          class="d-flex align-center justify-space-between mb-md-0 mb-4"
                        >
                          <div class="d-flex align-center">
                            <v-avatar
                              class="cursor-pointer"
                              color="red"
                              @click="movetoChannel"
                            >
                              <v-img
                                v-if="asset?.channel_thumbnail"
                                class="elevation-6"
                                :src="asset?.channel_thumbnail"
                              ></v-img>
                              <span v-else class="white--text headline">
                                {{ asset?.channel?.split("")[0].toUpperCase() }}
                              </span>
                            </v-avatar>

                            <p
                              class="ml-3 pb-0 pt-0 channel-name mr-4 cursor-pointer"
                              @click="movetoChannel"
                            >
                              {{ asset?.creator }}
                            </p>
                          </div>

                          <BaseBtn
                            height="36"
                            width="95"
                            color="black"
                            class="text-capitalize px-2 font-weight-medium elevation-0 text-caption"
                            dark
                            rounded
                            @click="
                              !isAuthenticated
                                ? openAuthDialog()
                                : isBtLiteAccount
                                ? followChannelWithBtLiteAccount()
                                : followChannel()
                            "
                          >
                            <p
                              class="mb-0 text-subtitle-2 follow-btn"
                              v-if="isFollowed"
                            >
                              Following
                            </p>
                            <p class="mb-0 text-subtitle-2" v-else>Follow</p>
                          </BaseBtn>
                        </div>
                        <div class="d-flex align-center justify-space-between">
                          <v-btn-toggle
                            density="compact"
                            class="toggle-btn-class"
                            dense
                            rounded="xl"
                            :border="true"
                            divided
                          >
                            <v-btn
                              icon
                              @click="
                                !isAuthenticated
                                  ? openAuthDialog()
                                  : isBtLiteAccount
                                  ? saveOrUpdateReactionLite({ relation: LIKE })
                                  : likeOrDislike(LIKE)
                              "
                            >
                              <v-icon
                                v-if="isVideosLikedByCurrentUser"
                                size="24"
                                >mdi-thumb-up</v-icon
                              >
                              <v-icon v-else size="24"
                                >mdi-thumb-up-outline</v-icon
                              >
                              <p
                                class="text-subtitle-2 mr-n3 ml-1"
                                v-if="asset?.publisher_likes"
                              >
                                {{ addTrailingCommas(asset?.publisher_likes) }}
                              </p>
                            </v-btn>
                            <v-btn
                              icon
                              @click="
                                !isAuthenticated
                                  ? openAuthDialog()
                                  : isBtLiteAccount
                                  ? saveOrUpdateReactionLite({
                                      relation: DISLIKE,
                                    })
                                  : likeOrDislike(DISLIKE)
                              "
                            >
                              <v-icon
                                v-if="isVideoDislikedByCurrentUser"
                                size="24"
                                >mdi-thumb-down</v-icon
                              >
                              <v-icon v-else size="24"
                                >mdi-thumb-down-outline</v-icon
                              >
                            </v-btn>
                          </v-btn-toggle>
                          <BaseBtn
                            color="#dcdcdc"
                            rounded
                            variant="outlined"
                            class="ml-2 grey-background"
                            @click="openCopyUrlDialog"
                          >
                            <v-icon color="black" size="26"
                              >mdi-share-outline</v-icon
                            >
                            <p class="mb-0 ml-1 share">Share</p>
                          </BaseBtn>
                          <BaseBtn
                            icon
                            small
                            color="#dcdcdc"
                            rounded
                            variant="outlined"
                            class="ml-2 px-0 dots-button rounded-circle"
                          >
                            <v-icon color="black" size="26"
                              >mdi-dots-horizontal</v-icon
                            >
                          </BaseBtn>
                        </div>
                      </div>
                    </v-card>
                    <div
                      v-if="asset?.contents"
                      class="pa-3 mt-4 grey-background"
                      style="background-color: #e5e5e5; border-radius: 5px"
                    >
                      <!-- <p class="black--text" v-html="asset?.contents">
                      </p> -->
                      <p v-if="asset?.contents.length > 205 && !showFull">
                        <span
                          v-html="textEllipsis(asset?.contents, 205, false)"
                        ></span>
                        <span
                          v-if="asset?.contents.length > 205"
                          class="font-weight-medium cursor-pointer"
                          @click="showFull = true"
                          >...more</span
                        >
                      </p>
                      <p v-else v-html="asset.contents" />
                    </div>
                  </v-responsive>
                </div>
              </v-skeleton-loader>
              <div class="mt-3">
                <VideoComment :asset="asset" />
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3" class="pt-3" tag="div">
          <BaseInfiniteScroller
            :items="rightPanelVideos.videos"
            @load="mapSegmentedVideos(rightPanelVideos, 25, $event)"
          >
            <div
              v-for="(video, i) in loading ? 12 : rightPanelVideos.videos"
              :key="i"
              class="mb-2 recommended-videos"
              :followed-accounts="followedAccounts"
              :style="{ height: mdAndUp ? '90px' : '100%' }"
              style="cursor: pointer"
              @click="
                replaceVideo(video);
                videoOptions.autoplay = 'play';
              "
            >
              <v-skeleton-loader
                style=""
                type="list-item-avatar-three-line"
                :loading="loading"
              >
                <video-card
                  :card="{ maxWidth: mdAndUp ? 370 : '100%' }"
                  :video="video.node"
                  :channel="video.origin"
                  @follow="followChannel(video.node, video.origin)"
                  style="width: 100%"
                  :small-card="mdAndUp"
                />
              </v-skeleton-loader>
            </div>
          </BaseInfiniteScroller>
        </v-col>
      </v-row>
    </v-container>
    <NonAuthDialog />
    <CopyUrlDialog :url="path" />
    <NonAuthMonitizedVideoDialog />
  </div>
</template>

<script setup>
import "video.js/dist/video-js.css";
import "videojs-youtube";
import VideoCard from "@/components/VideoCard.vue";
import VideoPlayer from "@/components/VideoPlayer.vue";
import { useWatch } from "./useWatch";
import { onMounted } from "vue";
import { useFollow, useHelper, useVideo, useBurstPoints } from "@/composables";
import { useAuthStore, useCoreStore } from "@/store";
import { onUnmounted } from "vue";
import { BaseBtn, BaseInfiniteScroller } from "@/components/base";
import {
  NonAuthDialog,
  CopyUrlDialog,
  NonAuthMonitizedVideoDialog,
} from "@/components/shared";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { toRefs } from "vue";
import { computed } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import VideoComment from "./comment/Comment.vue";

const coreStore = useCoreStore();
const { isAuthenticated } = toRefs(useAuthStore());
const router = useRouter();
const route = useRoute();
const { mdAndUp } = useDisplay();

const path = window.location.href;

const { textEllipsis, addTrailingCommas } = useHelper();
const { getFollowedChannels } = useFollow();
const { checkUserBurstPoints } = useBurstPoints();

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
  isFollowed,
  getVideo,
  getAssetReactionsById,
  followChannel,
  likeOrDislike,
  replaceVideo,
  addReactionAndBookmark,
  openAuthDialog,
  openCopyUrlDialog,
  mapSegmentedVideos,
  mapFollowIds,
  followChannelWithBtLiteAccount,
  saveOrUpdateReactionLite,
  getAssetReactionsLiteAccount,
} = useWatch();

const { loading } = useVideo();
const { isBtLiteAccount } = toRefs(useAuthStore());

const assetId = route.query?.asset_id;
const memberId = route.query?.member_id;
const cursor = route.query?.v;
const domain = localStorage.getItem("domain");

const movetoChannel = () => {
  router.push(
    `/channels?member_id=${memberId}&channel=${asset.value?.creator}`
  );
};

const showBurstIcon = computed(() => {
  const isMonitized = !!asset.value?.monetizations?.find(
    (item) => item.monetization_type !== "free"
  );
  if (isMonitized && !isAuthenticated.value) {
    coreStore.OpenDialog("nonAuthMonitizedVideoDialog");
    videoJs.value?.player?.autoplay(false);
  }
  return isMonitized;
});

onMounted(async () => {
  if (!assetId && !memberId && !cursor) {
    router.push({ name: "Home" });
  }
  coreStore.setDrawer(false);
  getFollowing.value =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("followedAccounts"))
      : null;

  if (isAuthenticated.value && domain) {
    const res = await getFollowedChannels();
    getFollowing.value = mapFollowIds(res?.data?.edges);
  }

  await getVideo(); // get Video from the route params

  if (isAuthenticated.value) {
    assetReactions.value = isBtLiteAccount.value
      ? await getAssetReactionsLiteAccount()
      : await getAssetReactionsById(assetId);
    if (assetReactions.value.length) {
      videoJs.value.player.on("loadstart", async () => {
        videoJs.value.player.currentTime(
          +assetReactions.value[0]?.node?.bookmark
        );
        await videoJs.value.player?.play();
        videoJs.value.player?.autoplay("play");
      });
    }
    if (!assetReactions.value.length) {
      isBtLiteAccount.value
        ? await saveOrUpdateReactionLite({ bookmark: "0" })
        : await addReactionAndBookmark(asset.value);
    }
    await checkUserBurstPoints();
  }
});

onUnmounted(() => {
  coreStore.setDrawer(true);
  coreStore.EmptyDialogs();
});
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
    padding-inline: 18px;
    width: fit-content;
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

.light-grey-background {
  background-color: #fafafa !important;
}

.recommended-videos {
  .thumbnail {
    max-height: 90px !important;
    min-height: 90px !important;
    max-width: 168px;
    object-fit: cover;
  }
}

@media (max-width: 440px) {
  .recommended-videos {
    .thumbnail {
      min-width: 100% !important;
      min-height: 203px !important;
      max-height: 203px !important;
    }
  }

  .channel-name {
    max-width: 300px !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-wrap: nowrap;
    overflow: hidden;
  }
}

.video-not-available {
  position: absolute;
  width: 100%;
  top: 30%;
  z-index: 1;
}

.follow-btn {
  font-weight: 600;
  font-size: 13px;
}

.comment-placeholder {
  ::placeholder {
    font-size: 14px;
  }
}
</style>
