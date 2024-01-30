<template>
    <div>
        <v-container>
            <div v-for="(video, i) in videos" :key="i" class="py-3" @click="getItem(video)">
                <video-card search-card :card="{ maxWidth: 370 }" :video="video.node" :channel="video.origin"
                    @follow="followChannel(video.node, video.origin)"></video-card>
            </div>
            <infinite-loading :distance="1" @infinite="getSearchResults($event)">
                <div slot="spinner">
                    <v-progress-circular
                  indeterminate
                  color="red"
                  :loading="loaded"
                ></v-progress-circular>
                </div>
                <div slot="no-results"></div>
                <span slot="no-more"></span>
                <div slot="error">
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
                                <v-btn>Take action</v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                </div>
            </infinite-loading>

        </v-container>
    </div>
</template>

<script>
import VideoCard from "@/components/VideoCard";
import VideoService from "@/services/VideoService";
import InfiniteLoading from "vue-infinite-loading";


export default {
    name: "Search",
    mixins: [],
    components: {
        VideoCard,
        InfiniteLoading
    },
    data: (vm) => ({
        videos: [],
        offset: 0,
        num: 30,
        text: vm.$route.query?.search_query,
        loaded:false
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
                const {data, status} = await VideoService.searchAssets(filter)
                if(data && status ){    
                   
                    this.offset = this.offset + 30
                    const currentScrollPosition = window.scrollY
                    window.scrollBy(currentScrollPosition, -100);
                    await this.$nextTick(()=>{
                        this.videos = [...this.videos, ...data]
                        $state.loaded()
                    })
                }
            } catch (error) {
                console.error("Error", error);
                $state?.complete()
            }finally{
                this.loaded = false
                $state?.loaded()
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
               await this.getSearchResults()
               console.log("Calling");
            },
            deep: true,
            immediate: false
        }
    }


};

</script>

<style lang="scss" scoped></style>