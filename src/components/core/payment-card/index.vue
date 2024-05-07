<template>
    <StripeElements v-if="stripeLoaded" v-slot="{ elements }" ref="elms" :stripe-key="stripeKey"
        :instance-options="instanceOptions" :elements-options="elementsOptions">
        <StripeElement ref="card" :elements="elements" :options="cardOptions" class="stripe-input" />
        <BaseBtn @click="pay(elements)">
            Pay
        </BaseBtn>
    </StripeElements>
</template>

<script setup>
import { StripeElements, StripeElement, } from 'vue-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ref, onBeforeMount } from 'vue'
import { BaseBtn } from '@/components/base';

const props = defineProps({
    secretKey: {
        type: String,
        default: null
    }
})


const stripeKey = ref('pk_test_51Op1bNEDh9W5MMcuHw0GxVCNusal3VC7jtaRUPizccYqKlRLzJqoC3CQTaw9jQyyqTfuG7R5T7wp9O2ugCW12kVr00r3tO3AJG') // test key
const instanceOptions = ref({
    publishableKey: 'pk_test_51Op1bNEDh9W5MMcuHw0GxVCNusal3VC7jtaRUPizccYqKlRLzJqoC3CQTaw9jQyyqTfuG7R5T7wp9O2ugCW12kVr00r3tO3AJG'
})
const elementsOptions = ref({
    clientSecret: 'pi_3PDaiyEDh9W5MMcu1qyr6THW_secret_toMtAklNOmVBm2pAaA9kYyGqa'
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

const pay = (elements) => {
    // Get stripe element
    const cardElement = card.value.stripeElement

    console.log("Elements", elements);
    // Access instance methods, e.g. createToken()
    elms.value.instance.confirmPayment({clientSecret: props.secretKey, elements: elements}).then((result) => {
        // Handle result.error or result.token
        console.log(result)
    })
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