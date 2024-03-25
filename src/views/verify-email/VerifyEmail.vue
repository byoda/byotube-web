<template>
    <div class="pa-10 ">
        <div class="text-center pt-7">
            <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
        </div>
        <div v-if="loader" class="text-center mt-10">
            <BaseSpinner :size="50" />
        </div>
        <div v-else>
            <div class="text-center pt-7">
                <img src="@/assets/email-confirmed.svg" :width="300" alt="" srcset="">
            </div>
            <div>
                <p class="text-center mt-6 text-grey-darken-2">
                    Congratulations! you have successfully verified your email address.
                </p>
            </div>
            <div class="text-center mt-6">
                <BaseBtn class="bg-primary elevation-0 white-text" @click="$router.push({ name: 'Home' })">
                    Move to Byo.tube
                    <template #append>
                        <v-icon class="text-white">
                            mdi-arrow-right
                        </v-icon>
                    </template>
                </BaseBtn>
            </div>
        </div>
        
    </div>
</template>
<script setup>
import { BaseBtn, BaseSpinner } from '@/components/base';
import { useHelper, useLoader } from '@/composables';
import { useAuthService } from '@/services';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const { loader, showLoader, hideLoader } = useLoader();
const { verifyEmail } = useAuthService()
const { channelQuery } = useHelper()

const liteId = route.query.lite_id
const token = route.query.token


const verifyEmailAddress = async () => {
    showLoader();
    setTimeout(async () => {
        try {
            showLoader();
            const params = channelQuery({ lite_id: liteId, token: token })
            console.log("Ads", params);
            await verifyEmail(params)
        } catch (error) {
            if (error) {
                const { detail } = error.response.data;
                showError(detail);
            }
        } finally {
            hideLoader();
        }
        
    }, 3000);
};

onMounted(() => {
    verifyEmailAddress()
})

</script>
<style lang="">

</style>