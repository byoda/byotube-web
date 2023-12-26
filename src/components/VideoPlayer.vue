<template>
    <div>
      <video controls ref="videoPlayer" class="video-js vjs-custom-skin"></video>
    </div>
  </template>
  
  <script>
  import videojs from 'video.js';
  import 'video.js/dist/video-js.css';
  
  export default {
    name: 'VideoPlayer',
    props: {
      options: {
        type: Object,
        default() {
          return {};
        }
      },
      contentToken:{
        type:String,
        default:null
      },
      keyId:{
        type:Number,
        default:null
      }
    },
    data() {
      return {
        player: null
      }
    },
    created(){
      videojs.Vhs.xhr.beforeRequest =  (options) => {
          if (options.headers == undefined){
              options.headers = {}
          }
          if (this.contentToken) {
              videojs.log(`Adding authorization headers with key_id ${this.keyId} and token ${this.contentToken}`)
              options.headers["Authorization"] = `Bearer ${this.contentToken}`
              options.headers["X-AuthorizationKeyId"] = this.keyId
          }

          return options;
      };
    },
    mounted() {
      this.player = videojs(this.$refs.videoPlayer, this.options, () => {
    });
    },
    beforeDestroy() {
      if (this.player) {
        this.player.dispose();
      }
    }
  }
  </script>