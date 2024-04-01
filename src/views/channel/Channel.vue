<template>
  <div id="channel-home" :style="{ 'padding-inline': mdAndUp ? '65px' : '10px' }">
    <div class="mt-2">
      <v-skeleton-loader type="card" :loading="loading" class="mr-1 mt-3 bg-transparent">
        <v-parallax height="230" style="border-radius: 15px;" :src="channelCover?.url"></v-parallax>
      </v-skeleton-loader>
    </div>
    <v-container class="py-0 px-0" id="my-cont">
      <div class="nav-bgcolor">
        <div id="channel-header">
          <v-row class="justify-space-between">
            <v-col cols="12">
              <v-skeleton-loader type="list-item-avatar-two-line" :loading="loading" class="mr-1 mt-5 bg-transparent">
                <template v-if="channel">
                  <v-row class="pl-3">
                    <v-col cols="12" md="2" size="160" class="px-0">
                      <img v-if="channelAvatar?.url" class="circle" :height="160" :width="160"
                        :src="channelAvatar?.url" />
                      <v-icon size="128" v-else>
                        mdi-account-circle-outline
                      </v-icon>
                    </v-col>
                    <v-col cols="12" md="8" class="pl-0">
                      <div class="d-flex ga-5">
                        <div>
                          <h1 class="channel-name">{{ channel.creator }}</h1>
                          <p class="channel-subtitle mb-0">
                            <span v-if="channel.creator">
                              @{{ channel.creator }}
                            </span>
                          </p>
                        </div>
                        <BaseBtn height="36" width="95" color="black" :loading="followLoading"
                          class="text-capitalize px-2 font-weight-medium elevation-0 text-caption" dark rounded
                          @click="isAuthenticated ? (isBtLiteAccount ? followChannelWithBtLiteAccount() : followChannel()) : openAuthDialog()">
                          <p class="subscribe-btn mb-0 px-2">
                            {{ getFollowing?.includes(remoteId) ? 'Following' : 'Follow' }}
                          </p>
                        </BaseBtn>
                      </div>
                      <p class="channel-subtitle py-2 mb-0">
                        {{ textEllipsis(channel?.description, 340) }}
                      </p>

                      <p v-html="dar">

                      </p>

                    </v-col>
                  </v-row>
                </template>
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
        <div class="mt-8">
          <h2 class="section-title text-secondary font-weight-medium">
            {{ sections.title }} {{ channelName }}
          </h2>
          <div class="grid-layout">
            <div v-for="(video, i) in sections.videos" :key="i" class="py-6" @click="moveToWatch(video)"
              style="position: relative;">
              <video-card :card="{ maxWidth: 370 }" style="position: absolute; width: 100%;" :video="video.node"
                :channel="video.origin" />
            </div>
          </div>
          <BaseInfiniteScroller class="base-scroller" :items="sections.videos" @load="getChannelVideos($event)">
            <template #loading>
              <div class="grid-layout">
                <div class="mt-6 w-100 " v-for="skeleten in 3" :key="skeleten">
                  <v-skeleton-loader type="card-avatar">
                  </v-skeleton-loader>
                </div>
              </div>
            </template>
          </BaseInfiniteScroller>
        </div>
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
    <NonAuthDialog />
  </div>
</template>

<script setup>
import VideoCard from '@/components/VideoCard.vue'
import { useChannel } from './useChannel.js'
import { onMounted } from "vue";
import { useDisplay } from 'vuetify'
import { BaseBtn, BaseInfiniteScroller } from '@/components/base';
import { useAuthStore } from '@/store';
import { toRefs } from 'vue';
import { useVideo, useFollow, useHelper } from '@/composables';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { NonAuthDialog } from '@/components/shared';


const { mdAndUp } = useDisplay()
const dar = " <html><body>Check out all of Jackery's products here!  <a href='https://www.jackery.com/pages/unveil-jackery-solar-generator-1000-pro-on-ifa-germany-2022?aff=873'>https://www.jackery.com/pages/unveil-jackery-solar-generator-1000-pro-on-ifa-germany-2022?aff=873</a><p><p><p>summer feels like its over now... feeling happy and sad 😦</body></html>"
const route = useRoute()

const { isAuthenticated } = toRefs(useAuthStore());
const { isBtLiteAccount } = toRefs(useAuthStore());
const { textEllipsis } = useHelper()

const { moveToWatch } = useVideo()

const {
  loading,
  channel,
  sections,
  channelName,
  channelAvatar,
  getFollowing,
  remoteId,
  followLoading,
  channelCover,
  refreshData,
  getChannel,
  getChannelVideos,
  followChannel,
  openAuthDialog,
  mapFollowIds,
  followChannelWithBtLiteAccount
} = useChannel()

const { getFollowedChannels } = useFollow()


onMounted(async () => {
  await getChannel()
  if (isAuthenticated.value) {
    getFollowing.value =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("followedAccounts"))
        : null;

    const { data } = await getFollowedChannels()
    getFollowing.value = mapFollowIds(data.edges)

  }
})

watch(() => (route.query.member_id || route.query.channel), async () => {
  refreshData(route.query.member_id, route.query.channel)
}, { immediate: false })

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

.base-scroller {
  .v-infinite-scroll__side {
    display: block !important;
  }
}
</style>
