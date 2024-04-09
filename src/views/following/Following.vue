<template>
    <div>
        <v-container class="container" fluid>
            <div v-if="loader" class="mt-6" v-for="skeleten in 3" :key="skeleten">
                <v-skeleton-loader type="list-item-avatar-two-line" :loading="loader">
                </v-skeleton-loader>
            </div>
            <div v-for="(channel, index) in channels" :key="index">
                <CreatorCard v-if="channel.value" :channel="channel.value" />
            </div>
        </v-container>
    </div>
</template>

<script setup>
import { CreatorCard } from '@/components/shared'
import { onMounted, toRefs } from "vue";
import { useAuthStore } from "@/store";
import { useFollowing } from './useFollowing';

const { isAuthenticated } = toRefs(useAuthStore())
const { channels, getChannels } = useFollowing()


onMounted(async () => {
    if (isAuthenticated.value) {
        await getChannels()
    }
})


</script>

<style lang="scss" scoped>
.container {
    max-width: 1096px;
}
</style>