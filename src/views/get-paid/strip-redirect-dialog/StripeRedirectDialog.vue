<template>
    <BaseDialog :name="name" width="500">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <h2>
                    Continue on Stripe.com
                </h2>
                <p class="mb-5 font-weight-medium">
                    BYO.Tube uses the Stripe Connect product to pay creators. Stripe is one of the major payment
                    processors in the USA and their Stripe Connect product is used by companies like Doordash, Instacard
                    and Github. To enable pay outs, you will need to click on the 'Continue on Stripe' button below to
                    register on the Stripe.com website and provide them with your bank and tax details. Stripe stores
                    this data in compliance with applicable regulations. We do not have access to that data; we only
                    know an identifier of your Stripe account so we can tell Stripe to pay money to your account.
                    We have found that registering with Stripe works best with the Chrome browser with any browser
                    extensions you may have installed for blocking scripts disabled.
                    If you have any questions or encounter issues during registration, please contact us at
                    payouts@byo.tube.
                </p>

                <div class="text-end">
                    <BaseBtn variant="text" color="red" class="mr-2" @click="CloseDialog(name)">
                        Cancel
                    </BaseBtn>
                    <BaseBtn class="bg-primary white-text elevation-0" @click="moveToStripe">
                        Continue on Stripe
                    </BaseBtn>
                </div>
            </BaseCard>
        </template>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, BaseCard, BaseTextfield, BaseBtn } from "@/components/base"
import { useCoreStore } from "@/store";
import { ref } from "vue";

const props = defineProps({
    url: {
        type: String,
        default: null
    }
})

const { OpenDialog, CloseDialog } = useCoreStore()

const name = 'stripe-redirect-dialog'

const moveToStripe = () => {
    window.open(props.url, '_self')

}
</script>