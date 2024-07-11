<template>
  <div id="home" class="pa-4">
    <v-container fluid>
      <main>
        <div v-for="(section, sectionIndex) in sections" :key="sectionIndex">
          <div v-if="section.videos.length">
            <h2 class="section-title text-secondary font-weight-medium">
              {{ section.title }}
            </h2>
            <div class="grid-layout mt-8">
              <div v-for="(video, i) in section.videos" :key="i" class="md:py-6" @click="moveToWatch(video)"
                :followed-accounts="followedAccounts" style="position: relative;">
                <video-card :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                  @follow="followChannel(video.node, video.origin)"
                  style="position: absolute; width: 100%;"></video-card>
              </div>
            </div>
            <div v-if="section.has_next_page & sectionIndex != sections?.length - 1" class="mt-10">
              <hr>
              <div class="text-center show-more-btn">
                <BaseBtn :loading="section.loading" color="grey-lighten-5" elevation="0" rounded
                  class="auth-btn show-more-btn font-weight-normal text-light-gray mt-n8"
                  @click="mapSegmentedVideos(section, sectionIndex, 24)">
                  Show More <v-icon left size="26" class="ml-2 font-weight-light">mdi-chevron-down</v-icon>
                </BaseBtn>
              </div>
            </div>

          </div>
        </div>
        <BaseInfiniteScroller
          @load="mapSegmentedVideos(sections[sections?.length - 1], sections?.length - 1, 24, $event)" class="mt-8" />
      </main>
    </v-container>
  </div>
</template>


<script setup>
import VideoCard from "@/components/VideoCard.vue";
import { useHome } from "./useHome";
import { useFollow, useEmitter } from "@/composables"
import { onMounted } from "vue";
import { BaseBtn, BaseInfiniteScroller } from "@/components/base";
import { watchEffect } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import { useAuthService } from "@/services";
import { useAuthStore, useCoreStore } from "@/store";
import { storeToRefs } from "pinia";
import { uuid } from "vue-uuid";

const props = defineProps({
  sectionNames: {
    default: null,
    type: Array
  },
})

const emitter = useEmitter()
const route = useRoute()
const { mutateLiteUserData, mutatePodUserData } = useAuthService()
const { isAuthenticated, isBtLiteAccount, isByotubeAccount } = storeToRefs(useAuthStore())

const { sections, ingestStatus, videosAccordingToSize, getAllSegmentedVideos, mapSegmentedVideos, emptySectionVideos, moveToWatch, getShortcut } = useHome(props)
const { followedAccounts } = useFollow()

const { width: windowWidth } = useDisplay();

const user = JSON.parse(localStorage.getItem('user'))
const domain = localStorage.getItem('domain')

onBeforeMount(() => {
  emitter.on("filter-changed", async ($event) => {
    ingestStatus.value = $event
    localStorage.setItem('videos-filter', JSON.stringify($event))
    if (isAuthenticated.value) {
      if (isBtLiteAccount.value) {
        const body = {
          nick: user?.nick,
          show_external_assets: $event.value !== 'published'
        }
        await mutateLiteUserData(body)
      } else {
        const body = {
          query_id: uuid.v4(),
          data: {
            nick: user?.nick,
            show_external_assets: $event.value !== 'published'
          },
        };
        await mutatePodUserData(domain, body)
      }
    }
    emptySectionVideos()
    getAllSegmentedVideos()
  });
})

onMounted(async () => {
  ingestStatus.value = JSON.parse(localStorage.getItem('videos-filter'))
  if (route.params?.shortcut) {
    getShortcut()
  }

  followedAccounts.value =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("followedAccounts"))
      : null;
})


watch(() => windowWidth.value, () => {
  if (windowWidth.value >= 1800 && windowWidth.value < 2100) {
    videosAccordingToSize.value = 15;
    emptySectionVideos()
    getAllSegmentedVideos()
  } else if (windowWidth.value > 1600) {
    videosAccordingToSize.value = 12;
    emptySectionVideos()
    getAllSegmentedVideos()
  } else {
    videosAccordingToSize.value = 9;
    emptySectionVideos()
    getAllSegmentedVideos()
  }
},);


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
</style>
