<template>
  <div>
    <video controls ref="videoPlayer" class="video-js vjs-custom-skin"></video>
  </div>
</template>

<!-- <script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@montevideo-tech/videojs-cmcd'
import { onBeforeMount } from 'vue';
import { onMounted } from 'vue';
import { onBeforeUnmount } from 'vue';

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    contentToken: {
      type: String,
      default: null
    },
    origin: {
      type: String,
      default: null
    },
    assetId: {
      type: String,
      default: null
    },
    keyId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      player: null,
      videojs,
    }
  },
  methods: {
    currentTime() {
      return this.player.cache_.currentTime
    },
  },

  created() {
    videojs.Vhs.xhr.beforeRequest = (options) => {
      if (options.headers == undefined) {
        options.headers = {}
      }
      if (this.contentToken) {
        options.headers["Authorization"] = `Bearer ${this.contentToken}`
        options.headers["X-AuthorizationKeyId"] = this.keyId
      }

      return options;
    };


  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
    });

    let vm = this

    const sessionid = localStorage.getItem('sessionId')
    this.player.cmcd({sid:sessionid, cid:'sdfdsf'});

  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>  -->

<script setup >
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@montevideo-tech/videojs-cmcd'
import { onBeforeMount, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    contentToken: {
      type: String,
      default: null
    },
    origin: {
      type: String,
      default: null
    },
    assetId: {
      type: String,
      default: null
    },
    keyId: {
      type: Number,
      default: null
    }
  })

  const player = ref(null)
  const videoPlayer = ref()
  const sessionid = localStorage.getItem('sessionId')

  const currentTime = () => {
      return player.value.cache_.currentTime
  }

  onBeforeMount(() => {
    videojs.Vhs.xhr.beforeRequest = (options) => {
      if (options.headers == undefined) {
        options.headers = {}
      }
      if (this.contentToken) {
        options.headers["Authorization"] = `Bearer ${props.contentToken}`
        options.headers["X-AuthorizationKeyId"] = props.keyId
      }

      return options;
    };


  })

  onMounted(() => {
    player.value = videojs(videoPlayer.value, props.options, () => {
    });
   
    player.value.cmcd({sid:sessionid, cid:`${props.origin}_${props.assetId}`});

  })

  onBeforeUnmount(()=> {
    if (player.value) {
      player.value.dispose();
    }
  })

  defineExpose({
    player,
    currentTime
  })

</script>

<style lang="scss">
.video-js {
  width: 100%;
  min-height: 480px;
  border-radius: 10px !important;

  .vjs-poster {
    border-radius: 10px;
  }

  div {
    border-radius: 20px;
  }

  img {
    border-radius: 20px;
  }
}
</style>