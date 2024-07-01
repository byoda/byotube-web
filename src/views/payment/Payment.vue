<template>
    <div class="pa-5 ">
        <div class="d-flex flex-column align-center">
            <Transition name="slide-fade">
                <div class="border rounded-lg pa-md-10 pa-5 bg-white " :class="{ 'w-50': mdAndUp }">
                    <BaseForm ref="form">
                        <p class="font-weight-medium text-h4">
                            Buy burst points
                        </p>
                        <div class="mt-10 d-flex align-center g-x-2">
                            <v-col cols="6">
                                <BaseTextfield v-model="amount" color="primary" label="Amount" prefix="$" hide-details :focused="true"
                                    name="amount" rules="numeric" density="comfortable" variant="outlined" />
                            </v-col>
                            <v-col cols="6">
                                <p class="text-body-1 pl-2"> = {{ addTrailingCommas(amount * 1000) }} burst points </p>
                            </v-col>
                        </div>
                        <div class="mt-3 d-flex">
                            <p class=" font-weight-medium">
                                $1 equals:
                            </p>
                            <p class="text-body-1 pl-2"> 1,000 burst points </p>
                        </div>
                        <div>
                            <p>
                                Watching one minute of video costs 1 burst point, equivalent to 1/10 of a cent. 
                            </p>
                        </div>
                        <div class="mt-5 text-end">
                            <BaseBtn class="bg-black elevation-0 white-text" @click="requestToken" :loading="loader">
                                Next
                            </BaseBtn>
                        </div>
                    </BaseForm>
                    <Transition name="slide-fade">
                        <div v-if="step == 2" class=" rounded-lg bg-white ">
                            <div class="mt-10">
                                <PaymentCard ref="payment" :secret-key="secretKey" :payment-id="paymentId" />
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>

        </div>

    </div>
</template>
<script setup>
import { BaseBtn, BaseForm, BaseTextfield } from "@/components/base"
import { PaymentCard } from "@/components/core";
import { useHelper, useLoader } from "@/composables";
import { constants } from "@/globals/constants";
import { usePaymentService } from "@/services";
import { ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

const { requestByopayToken, requestThirdPartyToken, requestSecretKey, setByopayToken } = usePaymentService()
const { mdAndUp } = useDisplay()
const { loader, showLoader, hideLoader } = useLoader()
const { addTrailingCommas } = useHelper()

const secretKey = ref('')
const paymentId = ref('')
const amount = ref(null)
const step = ref(1)
const payment = ref()

const requestToken = async () => {
    try {
        showLoader()
        const appId = 'f7d6d367-3d1a-4424-8ba5-139e8f3a51c3'
        const domain = localStorage.getItem('domain')
        const body = {
            service_id: constants.BYOTUBE_SERVICE_ID,
            target_id: appId,
            target_type: 'apps-'
        }
        const { data } = await requestThirdPartyToken(appId, domain, body)
        const { data: byopayData } = await requestByopayToken(data?.auth_token)
        setByopayToken(byopayData?.auth_token)
        localStorage.setItem('byopay-token', byopayData?.auth_token)
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
        paymentId.value = data?.payment_id
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