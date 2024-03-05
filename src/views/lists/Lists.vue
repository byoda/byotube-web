<template>
    <div id="home" class="pa-4">
        <v-container fluid>
        <div v-if="sections?.videos?.length" class="mt-8">
          <h2 class="section-title text-secondary font-weight-medium">
            {{ sections?.title }}
          </h2>
          <div class="grid-layout">
            <div v-for="(video, i) in sections?.videos" :key="i" class="py-6" @click="moveToWatch(video)"
              :followed-accounts="followedAccounts" style="position: relative;">
              <video-card :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                @follow="followChannel(video.node, video.origin)" style="position: absolute; width: 100%;"></video-card>
            </div>
          </div>
        </div>
        <BaseInfiniteScroller @load="getListVideos($event)" class="mt-8" />
        </v-container>
    </div>
</template>
  
  
<script setup>
import VideoCard from "@/components/VideoCard.vue";
import { useLists } from "./useLists";
import { useFollow, useEmitter, useVideo } from "@/composables"
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { BaseInfiniteScroller } from "@/components/base";

const emitter = useEmitter()
const route = useRoute()

const { moveToWatch } = useVideo()

const {
  sections,
  listName,
  getListVideos,
  changeSection
} = useLists()

const { followedAccounts } = useFollow()

onMounted(async() => {
    emitter.on("filter-changed", async($event) => {
        ingestStatus.value = $event
        emptySectionVideos()
        await getListVideos()
    });

    followedAccounts.value =
        typeof window !== "undefined"
            ? JSON.parse(window.localStorage.getItem("followedAccounts"))
            : null;

})

watch(()=>route.query.list_name, async()=>{
  changeSection(encodeURIComponent(route.query.list_name))
  await getListVideos()
})


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
  