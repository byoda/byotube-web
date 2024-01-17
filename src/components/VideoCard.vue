<template>
  <v-card
    class="content-bg card rounded-lg"
    flat
    tile
    router
    :class="{'d-flex':smallCard}"
  >
  <div>
    <v-img
      :src="`${thumbnail.url}`"
      :min-height="203"
      class="thumbnail"
    ></v-img>
  </div>
    <v-row no-gutters>
      <v-col
        cols="1"
        v-if="card.type != 'noAvatar' && !smallCard"
      >
        <div class="pl-0 pt-1" router :to="`/channels/${channel._id}`">
          <v-menu
            v-if="$store.getters.isAuthenticated"
            v-model="showMenu"
            offset-y
            origin="center center"
            :min-width="150"
            rounded
            transition="scale-transition"
            style="max-width: 600px;"
            :nudge-bottom="10"
            :close-on-content-click="false"
            :elevated="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-avatar v-on="on" v-bind="attrs" class="">
                <v-img
                  height="36"
                  max-width="36"
                  v-if="video.creator_thumbnail"
                  class="elevation-6"
                  :src="video.creator_thumbnail"
                ></v-img>
                <v-avatar v-else color="red">
                  <span class="white--text headline ">
                    {{ video.creator.split("")[0].toUpperCase() }}</span
                  >
                </v-avatar>
              </v-list-item-avatar>
            </template>
            <!-- <v-list>
                <v-list-item-group
                  color="danger"
                >
                  <v-list-item ripple selectable @click="$emit('follow')">
                    <v-list-item-title style="cursor: pointer;">
                      {{ followedAccounts && followedAccounts.includes(channel) ? 'Followed' : 'Follow' }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list> -->
          </v-menu>
          <v-list-item-avatar v-else>
            <v-img
              height="36"
              max-width="36"
              v-if="video.creator_thumbnail"
              class="elevation-6"
              :src="video.creator_thumbnail"
            ></v-img>
            <v-avatar v-else color="red">
              <span class="white--text headline ">
                {{ video.creator.split("")[0].toUpperCase() }}</span
              >
            </v-avatar>
          </v-list-item-avatar>
        </div>
        <!-- <p class="text-sm" style="font-size: 14px !important;">
            {{ video.creator }}
          </p> -->
      </v-col>
      <v-col :cols="smallCard ? 12 : 10" :class="{'pl-3':!smallCard}">
        <v-card-title
          class="pl-2 font-weight-bold whitespace-wrap"
          :class="{'text-sm': smallCard, 'subtitle-1': !smallCard, 'pt-3': !smallCard, 'pt-0':smallCard}"
          style="line-height: 1.2rem"
        >
        <!-- {{ video.title.slice(0,10) }} -->
          {{ smallCard ?  `${video.title.length > 35 ? `${video.title.slice(0,35)}...` : video.title }` : video.title }}
        </v-card-title>

        <v-card-subtitle class="pl-2 pb-0" :class="{'text-xs':smallCard}">
          {{ video.creator }}
        </v-card-subtitle>
        <v-card-subtitle class="pl-2 pb-0 pt-0 mt-n1">
          {{ convertDateToDuration(video.published_timestamp) }}
        </v-card-subtitle>
      </v-col>
      <v-col v-if="video.ingest_status === EXTERNAL && !smallCard" cols="1" class="pt-2">
        <v-img src="~@/assets/YouTube_icon.png" height="32" width="32"></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  name: "VideoCard",
  props: {
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
    smallCard:{
      type:Boolean,
      default:true
    },
    card: Object,
  },
  data() {
    return {
      url: process.env.VUE_APP_URL,
      EXTERNAL: "external",
      showMenu: false,
    };
  },
  computed: {
    thumbnail() {
      const findWithSize = this.video?.video_thumbnails?.find(tn => tn.size == "640x480") 
        || this.video?.video_thumbnails?.find(tn => tn.size == "1280x720")
        || this.video?.video_thumbnails?.find(tn => tn.size == "480x360")
        || this.video?.video_thumbnails?.find(tn => tn.size == "1920x1080")
      return findWithSize ? findWithSize : this.video?.video_thumbnails?.reduce((maxObject, currentObject) => {
        return currentObject['height'] > maxObject['height'] ? currentObject : maxObject;
      }, this.video.video_thumbnails[0])
    },
  },
  methods: {
    dateFormatter(date) {
      return moment(date).fromNow();
    },
    watchVideo() {
      localStorage.setItem("watch", JSON.stringify(this.video));
      this.$router.push({ name: "Watch" });
    },

    convertDateToDuration(date) {
      const currentDate = new Date();
      const inputDate = new Date(date);
      const timeDifference = currentDate - inputDate;

      const seconds = Math.floor(timeDifference / 1000);

      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (years > 0) {
        return `${years} year${years > 1 ? "s" : ""} ago`;
      } else if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
      } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        return "Just now";
      }
    },
  },
};
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

.whitespace-wrap{
  word-break: keep-all;
}

.thumbnail{
  max-width: 100%; 
  border-radius: 10px;
}
</style>
