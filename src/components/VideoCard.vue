<template>
  <v-card
    class="content-bg card mx-auto"
    :max-width="card.maxWidth"
    flat
    tile
    router
  >
    <v-img
      :src="`${video.video_thumbnails[2].url}`"
      :height="185"
      :width="328"
    ></v-img>
    <v-row no-gutters>
      <v-col cols="2" v-if="card.type != 'noAvatar'" style="position: relative; z-index: 10;">
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
                  <v-list-item-avatar v-on="on" v-bind="attrs">
                    <v-img
                      v-if="video.creator_thumbnail"
                      class="elevation-6"
                      :src="video.creator_thumbnail"
                
                    ></v-img>
                    <v-avatar v-else color="red">
                      <span class="white--text headline ">
                        {{ video.creator.split('')[0].toUpperCase() }}</span
                      >
                    </v-avatar>
                  </v-list-item-avatar>
              </template>
              <v-list>
                <v-list-item-group
                  color="danger"
                >
                  <v-list-item ripple selectable @click="$emit('follow')">
                    <v-list-item-title style="cursor: pointer;">
                      {{ followedAccounts && followedAccounts.includes(channel) ? 'Followed' : 'Follow' }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              
            </v-menu>
            <v-list-item-avatar v-else>
                    <v-img
                      v-if="video.creator_thumbnail"
                      class="elevation-6"
                      :src="video.creator_thumbnail"
                
                    ></v-img>
                    <v-avatar v-else color="red">
                      <span class="white--text headline ">
                        {{ video.creator.split('')[0].toUpperCase() }}</span
                      >
                    </v-avatar>
            </v-list-item-avatar>
          </div>
          <p class="text-sm" style="font-size: 14px !important;">
            {{ video.creator }}
          </p>
      </v-col>
      <v-col>
        <v-card-title
          class="pl-2 pt-3 subtitle-1 font-weight-bold"
          style="line-height: 1.2rem"
        >
          {{ video.title }}
        </v-card-title>

        <v-card-subtitle class="pl-2 pb-0">
          {{ channel.name }}
        </v-card-subtitle>
      </v-col>
      <v-col v-if="video.ingest_status === EXTERNAL" cols="1" class="pt-2">
        <v-img src="~@/assets/YouTube_icon.png" height="32" width="32" ></v-img>
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
      type: [Object,String],
      required: true,
    },
    followedAccounts: {
      type: [Array,String],
      required: true,
    },
    card: Object,
  },
  data() {
    return {
      url: process.env.VUE_APP_URL,
      EXTERNAL: 'external',
      showMenu:false
    };
  },
  methods: {
    dateFormatter(date) {
      return moment(date).fromNow();
    },
    watchVideo(){
      localStorage.setItem('watch', JSON.stringify(this.video))
      this.$router.push({name:'Watch'})
    }

  },
};
</script>

<style>
.text-sm{
  font-size: 14px !important;
  line-height: 16px;
}
</style>
