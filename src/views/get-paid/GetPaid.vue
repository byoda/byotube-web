<template>
    <div class="w-75 pa-5 mx-auto pt-10">
        <div class="bg-white pa-5 border rounded-lg px-8 pb-9">
            <BaseForm ref="registerForm">
                <h1>
                    Register
                </h1>
                <v-row>
                    <v-col cols="12" md="6">
                        <BaseTextfield v-model="accountDetails.email" class="mt-6" color="primary" density="comfortable"
                            name="email" rules="required|email" label="Email" variant="outlined">
                        </BaseTextfield>
                    </v-col>
                    <v-col cols="12" md="6">
                        <BaseTextfield v-model="accountDetails.first_name" class="mt-6" color="primary"
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
                    <div class="d-flex justify-end w-100 pr-3">
                        <BaseBtn color="primary" class="mt-2 white-text elevation-0" :loading="loader" @click="register">
                            Register
                        </BaseBtn>
                    </div>
                </v-row>
            </BaseForm>
        </div>
    </div>
</template>

<script setup>
import { BaseBtn, BaseTextfield, BaseForm } from '@/components/base';
import { useGetPaid } from './useGetPaid';

const { accountDetails, loader, registerForm, register } = useGetPaid()
</script>