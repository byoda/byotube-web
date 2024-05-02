<template>
    <div class="pa-5 text-center">
        <BaseBtn class="bg-primary elevation-0 white-text" @click="requestToken">
            Pay now!
        </BaseBtn>
    </div>
</template>
<script setup>
import { BaseBtn } from "@/components/base"
import { usePaymentService } from "@/services";

const { requestByopayToken, requestThirdPartyToken } = usePaymentService()

const requestToken = async () => {
    try {
        const appId = 'f7d6d367-3d1a-4424-8ba5-139e8f3a51c3'
        const { data } = await requestThirdPartyToken(appId)
        console.log("data", data);
        await requestByopayToken(data?.auth_token)
    } catch (error) {
        console.error("Error", error)
    }
}


</script>