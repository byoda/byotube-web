<template>
    <div class="pa-5 ">
        <div class="d-flex flex-column align-center">
            <Transition name="slide-fade">
                <div v-if="step === 1" class="border rounded-lg pa-10 bg-white " :class="{ 'w-50': mdAndUp }">
                    <BaseForm ref="form">
                        <p class="font-weight-medium text-h4">
                            Buy burst points
                        </p>
                        <div class="mt-10">
                            <BaseTextfield v-model="amount" color="primary" label="Amount" prefix="$" :focused="true"
                                name="amount" rules="numeric" density="comfortable" variant="outlined" />
                        </div>
                        <div>
                            <p class=" font-weight-medium">
                                $1 equals:
                            </p>
                            <p class="text-body-1"> 4000 burst points </p>
                        </div>
                        <div class="mt-5" v-if="amount">
                            <p class=" font-weight-medium">
                                You'll have
                            </p>
                            <p class="text-body-1"> {{ amount * 1000 }} burst points </p>
                        </div>
                        <div class="mt-5 text-end">
                            <BaseBtn class="bg-black elevation-0 white-text" @click="requestToken" :loading="loader">
                                Next
                            </BaseBtn>
                        </div>
                    </BaseForm>
                </div>
            </Transition>

            <Transition name="slide-fade">
                <div v-if="step == 2" :class="{ 'w-50': mdAndUp }" class="border rounded-lg pa-10 bg-white ">
                    <BaseBtn variant="text" @click="step = 1">
                        <template #prepend>
                            <v-icon>
                                mdi-chevron-left
                            </v-icon>
                        </template>
                        Back
                    </BaseBtn>
                    <div class="my-10">
                        <PaymentCard :secret-key="secretKey" />
                    </div>
                    <div class="text-end">
                        <BaseBtn class="elevation-0 bg-primary white-text" @click="step = 1">
                            Pay
                        </BaseBtn>
                    </div>
                </div>
            </Transition>
        </div>

    </div>
</template>
<script setup>
import { BaseBtn, BaseForm, BaseTextfield } from "@/components/base"
import { PaymentCard } from "@/components/core";
import { useLoader } from "@/composables";
import { usePaymentService } from "@/services";
import { ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

const { requestByopayToken, requestThirdPartyToken, requestSecretKey, setByopayToken } = usePaymentService()
const { mdAndUp } = useDisplay()
const { loader, showLoader, hideLoader } = useLoader()

const secretKey = ref('')
const amount = ref(null)
const step = ref(1)

const requestToken = async () => {
    try {
        showLoader()
        const appId = 'f7d6d367-3d1a-4424-8ba5-139e8f3a51c3'
        const { data } = await requestThirdPartyToken(appId)
        const { data: byopayData } = await requestByopayToken(data?.auth_token)
        setByopayToken(byopayData?.auth_token)
        await getSecretKey()

    } catch (error) {
        console.error("Error", error)
    }
}

const getSecretKey = async () => {
    try {
        const secretKeyBody = {
            'sku_name': 'byotube-burst-points-usd',
            'sku_parameters': {
                'cost_in_smallest_currency_unit': amount.value * 100
            }
        }
        const { data } = await requestSecretKey(secretKeyBody)
        secretKey.value = data.client_secret
        step.value = 2
    } catch (error) {
        console.error("Error", error)
    } finally {
        hideLoader()
    }
}


</script>

<style>
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(0.5, 0.5, 0.8, 0.5);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>