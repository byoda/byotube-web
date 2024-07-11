<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="5" lg="4" class="ma-auto shadow-smooth">
        <v-card outlined :loading="loading" class="rounded-lg">
          <div class="px-md-8 px-4 pt-6 pb-12">
            <div class="text-center">
              <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
            </div>
            <v-card-title class="my-2">Sign in</v-card-title>
            <v-card-text>
              <!-- <p class="mb-5">To become a member of BYO.Tube, you will need a BYODA personal data server. Please sign up
                for a personal data server at <a href="https://byo.host/"
                  class="text-primary text-decoration-none">BYO.Host</a> </p> -->
              <BaseForm ref="signinForm">
                <form @submit.prevent="signin">
                  <BaseRadioGroup v-model="accountType" class="ml-n4" hide-details label="Account Type" inline
                    @update:modelValue="signinData.domain = null">
                    <BaseRadio label="BYO.Tube Lite" value="btlite" />
                    <BaseRadio label="BYO.Tube Creator" value="byotube" />
                  </BaseRadioGroup>
                  <BaseTextfield v-model="signinData.email" class="mt-6" color="primary" name="Username"
                    rules="required" label="Email" variant="outlined">
                  </BaseTextfield>

                  <p class="ma-0 text-right">
                    <BaseBtn variant="text" small class="pl-0 text-capitalize" color="primary" href="true">Forgot
                      Password?</BaseBtn>
                  </p>
                  <BaseTextfield v-model="signinData.password" color="primary" name="Password" rules="required"
                  :type="visible ? 'text' : 'password'" label="Password" variant="outlined"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visible = !visible" />
                  <BaseTextfield v-model="signinData.domain" color="primary" :disabled="accountType == AccountType.LITE"
                    name="Domain" :rules="{ regex: /[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}/, required: accountType != AccountType.LITE  }" :key="accountType" custom-error="The Domain field is required for Creator accounts"
                    :label="accountType === AccountType.LITE ? 'Domain is not needed for BYO.Tube Lite accounts' : 'Domain'"
                    variant="outlined" class="mt-3"></BaseTextfield>
                  <div class="mt-2 d-flex justify-space-between white-text">
                    <BaseBtn type="submit" block class="bg-primary elevation-0" :loading="loader" depressed>Sign in
                    </BaseBtn>
                  </div>
                  <p class="pl-0 mb-2 mt-3">Don't have an account? <span class="text-primary cursor-pointer"
                      @click="$router.push({ name: 'AccountOptions' })">Sign Up</span>
                  </p>
                </form>
              </BaseForm>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { BaseBtn, BaseTextfield, BaseForm, BaseRadioGroup, BaseRadio } from '@/components/base';
import { useSignin } from './useSignin';
import { AccountType } from '@/globals/constants';
import { required } from '@vee-validate/rules';

const { signinForm, loader, signinData, accountType, visible, signin } = useSignin()

</script>

<style lang="scss">
.white-text {
  .v-btn__content {
    color: white !important;
  }
}
</style>
