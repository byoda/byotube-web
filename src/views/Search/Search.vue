<template>
    <div>
        <!-- <NavBar :loading="queryChangeLoaded" @search="queryChangeLoaded = true" /> -->
        <v-container>
            <div v-for="(video, i) in videos" :key="i" class="py-3" @click="moveToWatch(video)" style="cursor: pointer;">
                <video-card :search-card="true" :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                    @follow="followChannel(video.node, video.origin)"></video-card>
            </div>
            <!-- <p v-if="noMoreResults && !videos.length">
                <v-alert dense type="info" color="primary">
                    End of search results
                </v-alert>
            </p> -->
            <!-- <div v-if="loaded" class="text-center">
                <v-progress-circular indeterminate  color="red"></v-progress-circular>
            </div> -->
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
import { onMounted } from "vue";
import { BaseInfiniteScroller } from "@/components/base/index.js";

const route = useRoute()

const { getItem, moveToWatch } = useVideo()

const {
    text,
    videos,
    loaded,
    offset,
    queryChangeLoaded,
    noMoreResults,
    getSearchResults
} = useSearch()

watch(()=>route.query.search_query, async () => {
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

<!-- <script>
import VideoCard from "@/components/VideoCard";
import VideoService from "@/services/VideoService";
import NavBar from "@/components/NavBar.vue";
import { videosMixin } from "@/mixins";
import { watch } from "vue";
import { watchEffect } from "vue";
import { useRoute } from "vue-router";


export default {
    name: "Search",
    mixins: [videosMixin],
    components: {
        VideoCard,
        // InfiniteLoading,
        NavBar
    },
    data: (vm) => ({
        videos: [],
        offset: 0,
        num: 30,
        text: vm.$route.query?.search_query,
        loaded: false,
        queryChangeLoaded: null,
        noMoreResults: false
    }),
    methods: {
        async getSearchResults($state) {
            const text = this.text
            const offset = this.offset
            const num = this.num

            try {
                const filter = {
                    text,
                    offset,
                    num
                }
                this.loaded = true
                const { data, status } = await VideoService.searchAssets(filter)
                console.log("Data length", data.length);
                if (data && status) {
                    this.offset = this.offset + 30
                    const currentScrollPosition = window.scrollY
                    window.scrollBy(currentScrollPosition, -100);
                    await this.$nextTick(() => {
                        this.videos = [...this.videos, ...data]
                    })
                }

                if (!data.length) {
                    this.noMoreResults = true
                }
                $state?.loaded()

            } catch (error) {
                console.error("Error", error);
                $state?.error()
            } finally {
                this.loaded = false
                $state?.loaded()
                this.queryChangeLoaded = false
            }
        }
    },
    mounted() {
    },
    beforeUnmount() {
    },
    watch: {
        '$route.query.search_query': {
            handler: async function () {
                console.log("Caalinng");
                this.videos = []
                this.queryChangeLoaded = true
                await this.getSearchResults()
            },
            deep: true,
            immediate: false
        }
    }


};

</script> -->

<style lang="scss" scoped></style>