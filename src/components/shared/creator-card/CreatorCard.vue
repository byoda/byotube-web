<template>
    <div>
        <v-row align="center">
            <v-col col='3'>
                <div class="d-flex flex-column align-center">
                    <v-img class="rounded-circle" width="136" height="136" cover
                        :src="channel.channel_thumbnails[channel.channel_thumbnails.length - 1]?.url" />
                </div>
            </v-col>
            <v-col cols="8">
                <div>
                    <div>
                        <p class="font-weight-medium channel-title">
                            {{ channel?.creator }}
                        </p>
                        <p class="channel-subtitle mb-0 mt-2">
                            @{{ channel?.creator?.replace(/\s/g, "") }}
                        </p>
                        <p class="channel-subtitle mb-0 mt-1">
                            {{ channel?.description }}
                        </p>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { BaseBtn } from "@/components/base";

const props = defineProps({
    channel: {
        type: Object,
        default: null
    }
})

</script>

<style lang="scss">
.channel-title {
    font-size: 18px !important;
}

.channel-subtitle {
    font-size: 14px;
    color: #606060
}
</style>