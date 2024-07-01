<template>
    <div>
        <v-row align="center">
            <v-col md='3' cols="12">
                <div class="d-flex flex-column align-center">
                    <v-img class="rounded-circle" width="136" height="136" cover
                        :src="findThumbnailWithMaxHeight(channel.channel_thumbnails,176)?.url" />
                </div>
            </v-col>
            <v-col md="8" cols="12">
                <div>
                    <div class="text-center text-md-start">
                        <p class="font-weight-medium channel-title">
                            {{ channel?.creator }}
                        </p>
                        <p class="channel-subtitle mb-0 mt-2">
                            @{{ channel?.creator?.replace(/\s/g, "") }}
                        </p>
                        <p class="channel-subtitle mb-0 mt-1">
                            {{ textEllipsis(channel?.description, 300) }}
                        </p>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { BaseBtn } from "@/components/base";
import { useHelper } from "@/composables";

const props = defineProps({
    channel: {
        type: Object,
        default: null
    }
})

const { textEllipsis, findThumbnailWithMaxHeight } = useHelper()

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