<template>
    <StripeElements v-if="stripeLoaded" v-slot="{ elements }" ref="elms" :stripe-key="stripeKey"
        :instance-options="instanceOptions" :elements-options="elementsOptions">
        <StripeElement type="payment" ref="card" :elements="elements" :options="cardOptions" class="stripe-input" />
        <div class="text-end mt-8">
            <BaseBtn class="elevation-0 bg-primary white-text" :loading="loader" @click="pay(elements)">
                Pay
            </BaseBtn>
        </div>
    </StripeElements>
</template>

<script setup>
import { StripeElements, StripeElement, } from 'vue-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ref, onBeforeMount } from 'vue'
import { BaseBtn } from '@/components/base';
import { useLoader } from '@/composables';
import { usePaymentService } from '@/services';
import { useRouter } from 'vue-router';

const props = defineProps({
    secretKey: {
        type: String,
        default: null
    },
    paymentId: {
        type: String,
        default: null
    }
})

const router = useRouter()

const { loader, showLoader, hideLoader } = useLoader()
const { getReceipt, setByopayToken, attestBurstPoints } = usePaymentService()
const key = import.meta.env.VITE_STRIPE_KEY

const stripeKey = ref(key) // test key
const instanceOptions = ref({
    publishableKey: key
})
const elementsOptions = ref({
    clientSecret: props.secretKey
})
const cardOptions = ref({
    // https://stripe.com/docs/stripe.js#element-options
    value: {
        postalCode: '12345',
    },
})
const stripeLoaded = ref(false)
const card = ref()
const elms = ref()

onBeforeMount(() => {
    const stripePromise = loadStripe(stripeKey.value)
    stripePromise.then(() => {
        stripeLoaded.value = true
    })
})


const receipt = async (paymentId) => {
    try {
        await getReceipt(paymentId)
    } catch (error) {
        console.error("Error", error)
    }
}

const pay = async (elements) => {
    try {
        showLoader()
        const { error: submitError } = await elements.submit()
        await elms.value.instance.confirmPayment({ clientSecret: props.secretKey, elements: elements, redirect: 'if_required' })
        setByopayToken()
        await receipt(props.paymentId)
        await checkBurstPoints()
        router.push({name:'Transactions'})
    } catch (error) {
        console.error("Error", error)
    } finally {
        hideLoader()
    }
}


const checkBurstPoints = async () => {
    try {
        await attestBurstPoints(200)
    } catch (error) {
        console.error("Error", error)
    }
}




defineExpose({
    pay
})

</script>

<style>
.stripe-input {
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgb(219, 219, 219);
}
</style>