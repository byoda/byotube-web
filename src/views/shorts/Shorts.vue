<template>
        <h1>Shorts </h1>
        <Swiper :slides-per-view="1" :navigation="true" space-between="10" direction="vertical"  style="height: 85vh" v-if="shorts.videos.length > 0"> 
            <SwiperSlide v-for="(short, index) in shorts.videos" :key="index" >
                <div class="d-flex justify-center align-items-center" :key="reloadkey">
                    <div class="short-item">
                        <video-player
                            style="height: 85%; width: 100%; position: absolute;"
                            ref="videoJs"
                            :key="short?.node?.asset_id"
                            :options="short.videoOptions"
                            :key-id="key_id"
                            :content-token="content_token"
                            :asset-id="short?.node?.asset_id"
                            :origin="short?.origin"
                            :member-id="short?.origin"
                            :member-type="
                              !isAuthenticated
                                ? 'ANONYMOUS'
                                : isBtLiteAccount
                                ? 'btlite'
                                : 'member'
                            "
                          />
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { useShorts } from "./useShorts"
import { onMounted } from 'vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import { useWatch } from '../watch/useWatch';
import { useAuthStore } from '@/store';
import { toRefs } from 'vue';


const { isAuthenticated, isBtLiteAccount } = toRefs(useAuthStore());
const { shorts, reloadkey, getVideos } = useShorts()
const {
  asset,
  key_id,
  content_token,
  getVideoOptions,
  playerKey,
  videoJs,
} = useWatch();


onMounted(() => {
    getVideos(shorts.value, 50)
})


</script>

<style scoped>
.shorts-container {
    padding: 20px;
}

.short-item {
    margin-bottom: 20px;
    width: 70vw;
    /* height: 85vh; */
    height: 100vh;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
}

.blue{

    background-color: blue;
}

.green{
    background-color: green;
}

.red{
    background-color: red;
}

.short-item h2 {
    margin: 0;
}

.short-item p {
    margin: 5px 0 0;
}
</style>
