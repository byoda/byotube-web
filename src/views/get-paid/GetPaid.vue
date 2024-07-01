<template>
    <div class="pa-5 mx-auto pt-10" :class="{'w-75' : !smAndDown}">
        <div class="bg-white pa-5 border rounded-lg px-8 pb-9">
            <BaseForm ref="registerForm">
                <h1>
                    Register
                </h1>
                <v-row class="mt-6">
                    <v-col cols="12" md="6" class="pt-0">
                        <BaseTextfield v-model="accountDetails.email" color="primary" density="comfortable"
                            name="email" rules="required|email" label="Email" variant="outlined">
                        </BaseTextfield>
                    </v-col>
                    <v-col cols="12" md="6" class="pt-0">
                        <BaseTextfield v-model="accountDetails.first_name" color="primary"
                            density="comfortable" name="first name" rules="required" label="First name"
                            variant="outlined">
                        </BaseTextfield>
                    </v-col>
                    <v-col cols="12" md="6" class="pt-0">
                        <BaseTextfield v-model="accountDetails.last_name" color="primary" density="comfortable"
                            name="lastName" rules="required" label="Last name" variant="outlined">
                        </BaseTextfield>
                    </v-col>
                    <v-col cols="12" md="6" class="pt-0">
                        <BaseTextfield v-model="accountDetails.country" color="primary" density="comfortable"
                            name="country" label="Country" variant="outlined">
                        </BaseTextfield>
                    </v-col>
                    <v-col cols="12" md="12" class="pt-0">
                        <BaseTextfield v-model="accountDetails.business_name" color="primary" density="comfortable"
                            name="business name" label="Business Name" variant="outlined" hide-details>
                        </BaseTextfield>
                    </v-col>
                    <div class="px-3 my-2">
                        <div class="primary-border pa-3">
                            <p class="text-caption">
                                BYO.Tube uses the Stripe Connect product to pay creators. Stripe is one of the major payment
                                processors in the USA and their Stripe Connect product is used by companies like Doordash,
                                Instacard
                                and Github. 
                            </p>
                            <p class="text-caption">
                                To enable pay outs, you will need to click on the 'Continue on Stripe' button below
                                to
                                register on the Stripe.com website and provide them with your bank and tax details. Stripe
                                stores
                                this data in compliance with applicable regulations. We do not have access to that data; we only
                                know an identifier of your Stripe account so we can tell Stripe to pay money to your account.
                            </p>
                            <p class="text-caption">
                                We have found that registering with Stripe works best with the Chrome browser with any browser
                                extensions you may have installed for blocking scripts disabled.
                            </p>
                            <p class="text-caption">
                                If you have any questions or encounter issues during registration, please contact us at
                                payouts@byo.tube.
                            </p>
                        </div>
                    </div>
                    <div class="d-md-flex justify-end w-100 pr-3 mt-2">
                        <BaseBtn color="red" variant="outlined" :block="smAndDown" class="mt-2 mr-2 elevation-0"
                            @click="$router.push({name: 'Transactions'})">
                            Cancel
                        </BaseBtn>
                        <BaseBtn color="primary" :block="smAndDown" class="mt-2 white-text elevation-0" :loading="loader"
                            @click="register">
                            Continue to stripe
                        </BaseBtn>
                    </div>
                </v-row>
            </BaseForm>
            <StripeRedirectDialog :url="stripeUrl" />
        </div>
    </div>
</template>

<script setup>
import { BaseBtn, BaseTextfield, BaseForm } from '@/components/base';
import { useGetPaid } from './useGetPaid';
import StripeRedirectDialog from "./strip-redirect-dialog/StripeRedirectDialog.vue"
import { useDisplay } from 'vuetify/lib/framework.mjs';

const { accountDetails, loader, registerForm, stripeUrl, register } = useGetPaid()
const { smAndDown } = useDisplay()
</script>

<style lang="scss">
.primary-border{
    border: 1px solid #f29616b6;
    border-radius: 4px;
}
</style>