<template>
    <div>
        <v-container>
            <div v-for="(video, i) in videos" :key="i" class="py-3" @click="moveToWatch(video)"
                style="cursor: pointer;">
                <video-card :search-card="true" :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                    @follow="followChannel(video.node, video.origin)"></video-card>
            </div>
            <BaseInfiniteScroller @load="getSearchResults($event)" />

        </v-container>
    </div>
</template>

<script setup>
import VideoCard from "@/components/VideoCard.vue";
import { useSearch } from "./useSearch.js"
import { useRoute } from "vue-router";
import { watch } from "vue";
import { useVideo } from "@/composables";
import { BaseInfiniteScroller } from "@/components/base/index.js";

const route = useRoute()

const { moveToWatch } = useVideo()

const {
    text,
    videos,
    offset,
    queryChangeLoaded,
    getSearchResults
} = useSearch()

watch(() => route.query.search_query, async () => {
    videos.value = []
    offset.value = 0
    queryChangeLoaded.value = true
    text.value = route.query?.search_query
    await getSearchResults()

}, {
    deep: true,
    immediate: false
})


</script>


<style lang="scss" scoped></style>