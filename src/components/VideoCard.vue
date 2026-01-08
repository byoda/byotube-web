<template>
  <v-card
    class="content-bg card rounded-lg"
    flat
    tile
    router
    :class="{ 'd-md-flex': smallCard || searchCard }"
  >
    <v-img
      :src="`${thumbnailForVideo(props.video)?.url}`"
      :height="thumbnailHeight"
      :width="setThumbnailWidth"
      :max-width="setThumbnailMaxWidth"
      :max-height="searchCard ? 202 : 281"
      cover
      class="thumbnail cursor-pointer"
      :class="{ 'search-thumbnail': searchCard }"
    ></v-img>
    <v-row no-gutters>
      <v-col
        class="cursor-pointer"
        cols="1"
        v-if="card.type != 'noAvatar' && !smallCard && !searchCard"
        @click.stop="movetoChannel"
      >
        <div
          class="pl-0 pt-3"
          router
          :to="`/channels?member_id=${video?.node?.member_id}&channel=${video?.node?.annotations[0]}`"
        >
          <v-menu
            v-if="isAuthenticated"
            v-model="showMenu"
            offset-y
            origin="center center"
            :min-width="150"
            rounded
            transition="scale-transition"
            style="max-width: 600px"
            :nudge-bottom="10"
            :close-on-content-click="false"
            :elevated="false"
          >
            <template v-slot:activator="{ attrs }">
              <v-avatar v-bind="attrs" class="cursor-pointer" color="red">
                <v-img
                  height="40"
                  max-width="40"
                  v-if="video.channel_thumbnail"
                  class="elevation-6"
                  :src="video.channel_thumbnail"
                ></v-img>
                <span v-else class="white--text headline">
                  {{ video?.channel?.split("")[0].toUpperCase() }}</span
                >
              </v-avatar>
            </template>
          </v-menu>
          <v-avatar v-else :size="36">
            <v-img
              v-if="video.channel_thumbnail"
              class="elevation-6"
              :src="video.channel_thumbnail"
            ></v-img>
            <span v-else class="white--text headline">
              {{ video?.channel?.split("")[0].toUpperCase() }}</span
            >
          </v-avatar>
        </div>
      </v-col>
      <v-col
        :cols="smallCard ? 11 : 9"
        :class="{ 'pl-3': !smallCard, 'pl-md-3': searchCard }"
      >
        <div :class="{ 'd-flex': searchCard }">
          <div v-if="searchCard" class="mt-2">
            <img
              v-if="video?.ingest_status === EXTERNAL && !smallCard"
              src="@/assets/YouTube_icon.png"
              height="36"
              width="36"
            />
            <img
              v-if="video?.ingest_status !== EXTERNAL && showBurstIcon"
              height="30"
              src="@/assets/Burst_icon.png"
              alt=""
              srcset=""
              class="mt-1"
            />
          </div>
          <div
            :class="{
              'ml-7':
                searchCard &&
                !showBurstIcon &&
                video?.ingest_status !== EXTERNAL,
            }"
          >
            <v-card-title
              class="pl-2 pb-0 font-weight-bold whitespace-wrap cursor-pointer"
              :class="{
                'text-sm overflow-visible': smallCard,
                'subtitle-1': !smallCard,
                'pt-3': !smallCard,
                'py-0': smallCard,
                'pb-1': searchCard,
              }"
              style="line-height: 1.2rem"
              :style="{ 'font-size': searchCard ? '18px !important' : '16px' }"
            >
              {{
                smallCard || (searchCard && smAndDown)
                  ? `${
                      video?.title?.length > 20
                        ? `${video?.title?.slice(0, searchCard && smAndDown ? 30 : 18)}...`
                        : video?.title
                    }`
                  :  video.title?.length > 75 ? video?.title?.slice(0,80) + '...' : video.title
              }}
            </v-card-title>

            <div
              :class="{
                'd-flex align-center justify-space-between mt-n2':
                  video?.ingest_status !== EXTERNAL &&
                  showBurstIcon &&
                  smallCard,
              }"
            >
              <div>
                <v-card-subtitle
                  v-if="!searchCard"
                  class="pl-2 pb-0 cursor-pointer"
                  :class="{ 'text-xs': smallCard }"
                  @click.stop="movetoChannel"
                >
                  {{
                    `${
                      video?.channel?.length > 10 &&
                      video?.ingest_status !== EXTERNAL &&
                      showBurstIcon &&
                      smallCard
                        ? `${video?.channel?.slice(0, 10)}...`
                        : video?.creator
                    }`
                  }}
                </v-card-subtitle>

                <v-card-subtitle class="pl-2 pb-0 pt-0 d-flex ga-1">
                  <span
                    v-if="video?.publisher_views"
                    class="d-flex align-center"
                    >{{ addTrailingCommas(video?.publisher_views) }} views
                    <div class="dot ml-1"></div
                  ></span>
                  {{ convertDateToDuration(video?.published_timestamp) }}
                </v-card-subtitle>
              </div>
              <div
                v-if="
                  video?.ingest_status !== EXTERNAL &&
                  showBurstIcon &&
                  smallCard
                "
              >
                <v-col cols="1" class="">
                  <img
                    height="30"
                    src="@/assets/Burst_icon.png"
                    alt=""
                    srcset=""
                    class="mb-n2"
                  />
                </v-col>
              </div>
            </div>
            <div
              v-if="searchCard"
              class="d-flex items-center py-3 pl-2"
              @click.stop="movetoChannel"
            >
              <v-avatar class="cursor-pointer">
                <img
                  height="40"
                  max-width="40"
                  v-if="video?.channel_thumbnail"
                  class="elevation-6"
                  :src="video?.channel_thumbnail"
                />
                <span v-else class="white--text headline">
                  {{ video?.channel.split("")[0].toUpperCase() }}</span
                >
              </v-avatar>
              <v-card-subtitle
                class="pl-2 pb-0 pt-0 d-flex align-center cursor-pointer"
                :class="{ 'text-xs': smallCard }"
              >
                {{ video?.creator }}
              </v-card-subtitle>
            </div>
            <v-card-subtitle
              v-if="searchCard"
              class="pl-2 pb-0 pt-0 mt-n1 description-ellipses"
              @click.stop="movetoChannel"
            >
              {{ video?.contents }}
            </v-card-subtitle>
          </div>
        </div>
      </v-col>
      <v-col
        v-if="video?.ingest_status === EXTERNAL && !smallCard && !searchCard"
        cols="2"
        class="pt-2 text-end"
      >
        <img src="@/assets/YouTube_icon.png" height="36" width="36" />
      </v-col>
      <v-col
        v-if="video?.ingest_status !== EXTERNAL && showBurstIcon && !searchCard"
        cols="1"
        class="pt-2"
      >
        <img
          height="30"
          src="@/assets/Burst_icon.png"
          alt=""
          srcset=""
          class="ml-n3"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { useHelper } from "@/composables";
import { useAuthStore } from "@/store";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify/lib/framework.mjs";

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
  channel: {
    type: [Object, String],
    required: true,
  },
  followedAccounts: {
    type: [Array, String],
    required: false,
  },
  smallCard: {
    type: Boolean,
    default: false,
  },
  searchCard: {
    type: Boolean,
    default: false,
  },
  thumbnailHeight: {
    type: [Number, String],
    default: 203,
  },
  thumbnailWidth: {
    type: [Number, String],
    default: null,
  },
  thumbnailMaxWidth: {
    type: [Number, String],
    default: null,
  },
  card: Object,
});

const { convertDateToDuration, addTrailingCommas } = useHelper();
const { isAuthenticated } = useAuthStore();
const router = useRouter();
const { smAndDown } = useDisplay()

const EXTERNAL = "external";
const showMenu = ref(false);

const movetoChannel = () => {
  router.push(
    `/channels?member_id=${props.channel}&channel=${props.video?.creator}`
  );
};

const thumbnailForVideo = (video) => {
  const smallerThumbnailVideo = video?.video_thumbnails?.find(
    (thumbnail) => thumbnail?.width >= 240
  );
  if (smallerThumbnailVideo) return smallerThumbnailVideo;
  else return video?.video_thumbnails?.[video?.video_thumbnails?.length - 1];
};

const setThumbnailWidth = computed(() => {
  return props.thumbnailWidth
    ? props.thumbnailWidth
    : '100%'
});

const setThumbnailMaxWidth = computed(() => {
  return props.thumbnailMaxWidth
    ? props.thumbnailMaxWidth
    : props.searchCard
    ? 360
    : "auto";
});

const showBurstIcon = computed(() => {
  return !!props.video?.monetizations?.find(
    (item) => item.monetization_type !== "free"
  );
});
</script>

<style>
.text-sm {
  font-size: 14px !important;
  line-height: 16px;
}

.text-xs {
  font-size: 12px !important;
  line-height: 16px;
}

.whitespace-wrap {
  word-break: keep-all;
}

.thumbnail {
  max-width: 100%;
  border-radius: 10px;
}

.search-thumbnail {
  max-width: 360px;
}

.description-ellipses {
  max-width: 730px;
  text-overflow: ellipsis !important;
  white-space: nowrap;
  overflow: hidden;
}

@media (max-width: 440px) {
  .description-ellipses {
    max-width: 300px;
  }
}

.dot {
  height: 3px;
  width: 3px;
  background-color: #777777;
}
</style>
