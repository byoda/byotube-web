<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="8" md="5" lg="4" class="ma-auto shadow-smooth">
        <v-card class="rounded-lg pa-md-5 pa-2" outlined :loading="loading">
          <div class="text-center pt-7">
            <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
          </div>
          <v-row class="justify-space-between px-md-4 pt-6 pb-5">
            <v-col cols="12">
              <v-card-subtitle class="mb-5">Create your BYO.Tube account</v-card-subtitle>
              <v-card-text>
                <BaseForm ref="signupForm">
                  <v-row>
                    <v-col cols="12">
                      <BaseRadioGroup v-model="accountType" hide-details label="Account Type" inline>
                        <BaseRadio label="BYO.Tube Lite" value="lite" />
                        <BaseRadio label="BYO.Tube Creator" value="byotube" />
                      </BaseRadioGroup>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <BaseTextfield v-model="signupData.email" label="Email" color="primary" name="Email" class="mb-1"
                        variant="outlined" rules="required|email" />
                    </v-col>
                    <v-col cols="12">
                      <BaseTextfield v-model="signupData.handle"
                        :label="accountType === AccountType.LITE ? 'Domain is not needed for BYO.Tube Lite accounts' : 'Domain'"
                        name="Domain" color="primary" variant="outlined" :rules="isByotubeAccount ? 'required' : ''"
                        :disabled="!isByotubeAccount" :key="accountType" />
                    </v-col>
                    <v-col cols="12" class="py-0">
                      <BaseTextfield v-model="signupData.password" :type="passwordVisible ? 'text' : 'password'" name="Password" label="Password"
                        color="primary" variant="outlined" rules="required"  :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="passwordVisible = !passwordVisible" />
                    </v-col>
                    <v-col cols="12" class="">
                      <BaseTextfield :type="confirmPasswordVisible ? 'text' : 'password'" v-model="signupData.confirmPassword" :disabled="isByotubeAccount"
                        name="Confirm Password" color="primary"
                        :label="isByotubeAccount ? 'Password confirmation not needed for BYO.Tube Creator accounts' : 'Confirm Password'"
                        variant="outlined" :rules="!isByotubeAccount ? 'confirmed:@Password' : ''" :append-inner-icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="confirmPasswordVisible = !confirmPasswordVisible" />
                    </v-col>
                  </v-row>
                  <div class="mt-6">
                    <p class="pl-0 mb-2">Already have an account? <span class="text-primary cursor-pointer"
                        @click="$router.push({ name: 'SignIn' })">Sign in</span>
                    </p>
                    <BaseBtn block type="submit" class="bg-primary elevation-0 white-text" :loading="loader" depressed
                      @click="signup">
                      Sign up
                    </BaseBtn>
                    <p class="pl-0 mb-2 mt-4">To create a full featured BYO.Tube account, you need a BYODA Personal Data
                      Server. You can get one from <span class="text-primary cursor-pointer"> <a
                          href="https://api.byo.host/signup" target="_blank" class="text-primary">BYO.Host</a></span>
                    </p>
                  </div>
                </BaseForm>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { BaseBtn, BaseForm, BaseRadio, BaseTextfield, BaseRadioGroup } from '@/components/base';
import { useSignup } from './useSignup';
import { useRoute } from 'vue-router';
import { AccountType } from '@/globals/constants';
import { computed } from 'vue';


const route = useRoute()

const loading = ref(false)

const { loader, signupData, signupForm, passwordVisible, confirmPasswordVisible, signup } = useSignup()

const accountType = ref(route.query['account-type'] || 'byotube')

const isByotubeAccount = computed(() => {
  return accountType.value === AccountType.BYOTUBE
})

</script>

<style scoped></style>
