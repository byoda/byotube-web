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
        player: null,
        videojs
      }
    },
    methods:{
        currentTime(){
          return  this.player.cache_.currentTime
        },
    },

    created(){

     
      videojs.Vhs.xhr.beforeRequest =  (options) => {
          if (options.headers == undefined){
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

    },
    beforeDestroy() {
      if (this.player) {
        this.player.dispose();
      }
    }
  }
  </script>

  <style lang="scss">
  .video-js {
    width: 100%;
    min-height: 480px;
    border-radius: 10px !important;
    .vjs-poster{
      border-radius: 10px;
    }
    div{
      border-radius: 20px;
    }
    img{
      border-radius: 20px;
    }
  }
  </style>