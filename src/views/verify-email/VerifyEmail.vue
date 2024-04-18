<template>
    <div class="pa-10 ">
        <div class="text-center pt-7">
            <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
        </div>
        <div v-if="loader" class="text-center mt-10">
            <BaseSpinner :size="50" />
        </div>
        <div v-else-if="!apiError">
            <div class="text-center pt-7">
                <img src="@/assets/email-confirmed.svg" :width="300" alt="" srcset="">
            </div>
            <div>
                <p class="text-center mt-6 text-grey-darken-2">
                    Congratulations! you have successfully verified your email address.
                </p>
            </div>
            <div class="text-center mt-6">
                <BaseBtn class="bg-primary elevation-0 white-text" @click="$router.push({ name: 'SignIn' })">
                    Go to BYO.Tube
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
import { useAlert, useHelper, useLoader } from '@/composables';
import { useAuthService } from '@/services';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const { loader, showLoader, hideLoader } = useLoader();
const { verifyEmail } = useAuthService()
const { toQueryString } = useHelper()
const { showError } = useAlert()

const liteId = route.query.lite_id
const token = route.query.token
const apiError = ref(false)


const verifyEmailAddress = async () => {
    showLoader();
    apiError.value = false
    setTimeout(async () => {
        try {
            showLoader();
            const params = toQueryString({ lite_id: liteId, token: token })
            await verifyEmail(params)
        } catch (error) {
          apiError.value = true
            if (error) {
                showError('There is a problem with your verification link. Please try to sign up again or contact support@byo.tube');
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