<template>
    <div>
        <v-container class="container" fluid>
            <v-row>
                <v-col cols="8">
                    <div class="text-center" v-if="loader">
                        <v-progress-circular indeterminate color="red"></v-progress-circular>
                    </div>
                    <p v-if="!loader && !sections.videos.length" class="font-weight-medium text-center">
                        No videos!
                    </p>
                    <v-sheet v-for="(video, i) in sections.videos" :key="i" class="long-text-ellipses mt-8"
                        position="relative" style="cursor: pointer;">
                        <video-card thumbnail-width="248" thumbnail-max-width="248" thumbnail-height="138"
                            :search-card="true" :card="{ maxWidth: 248 }" :video="video.node" :channel="video.origin"
                            @follow="followChannel(video.node, video.origin)" @click="moveToWatch(video)"></video-card>
                        <v-sheet
                            class="rounded-circle top-78 bg-amber-darken-1 left-2 d-flex flex-column align-center justify-center"
                            position="absolute" height="55" width="55" :key="key * i">
                            <div class="pr-2 -mb-1"
                                @click="!isAuthenticated ? openAuthDialog() : addReaction(LIKE, allAssetReactions, video?.node, video?.origin)">
                                <v-icon v-ripple color="white"
                                    v-if="isVideosLikedByCurrentUser(allAssetReactions, video.node)"
                                    size="25">mdi-thumb-up</v-icon>
                                <v-icon v-ripple color="white" v-else size="25">mdi-thumb-up-outline</v-icon>
                            </div>
                            <div class="pl-2 mt-n1"
                                @click="!isAuthenticated ? openAuthDialog() : addReaction(DISLIKE, allAssetReactions, video?.node, video?.origin)">
                                <v-icon v-ripple color="white"
                                    v-if="isVideoDislikedByCurrentUser(allAssetReactions, video.node)"
                                    size="25">mdi-thumb-down</v-icon>
                                <v-icon v-ripple color="white" v-else size="25">mdi-thumb-down-outline</v-icon>
                            </div>

                        </v-sheet>
                    </v-sheet>
                </v-col>
                <v-col cols="4" class="d-none d-md-block px-5">
                    <div class="sticky-menu">
                        <div>
                            <BaseTextfield v-model="search" color="primary" variant="underlined" rounded hide-details
                                prepend-inner-icon="mdi-magnify" placeholder="Search watch history" :active="true"
                                density="compact" />
                            <v-list-item v-for="(item, index) in list" :key="index" rounded="xl" class="mb-0 mt-4"
                                :value="item.title" nav color="primary" @click="item.method">
                                <template #prepend>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </template>
                                <v-list-item-title>

                                    <template #default>
                                        <p class="font-weight-bold text-body-2">
                                            {{ item.title }}
                                        </p>
                                    </template>
                                </v-list-item-title>
                            </v-list-item>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>

    </div>
</template>

<script setup>
import VideoCard from "@/components/VideoCard.vue";
import { useHistory } from "./useHistory.js"
import { onMounted, toRefs } from "vue";
import { BaseTextfield } from '@/components/base'
import { useAssetReaction, useLoader } from "@/composables/index.js";
import { useAuthStore } from "@/store/index.js";

const { isAuthenticated } = toRefs(useAuthStore())
const { loader, showLoader, hideLoader } = useLoader()

const { key, list, search, sections, allAssetReactions, getHistoryVideos, moveToWatch, addReaction } = useHistory()
const { LIKE, DISLIKE, isVideoDislikedByCurrentUser, isVideosLikedByCurrentUser, openAuthDialog } = useAssetReaction()

onMounted(async () => {
    showLoader()
    await getHistoryVideos(null, sections.value, 25)
    hideLoader()
})

</script>

<style lang="scss">
.container {
    max-width: 1096px;
}

.sticky-menu {
    position: fixed;
    top: 30%;
    width: 348px;
}

.long-text-ellipses {
    div {
        .v-card-title {
            text-overflow: ellipsis;
            max-width: 500px;
        }
    }
}
</style>