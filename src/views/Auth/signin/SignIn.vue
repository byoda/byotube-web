<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="5" lg="4" class="ma-auto shadow-smooth">
        <v-card outlined :loading="loading" class="rounded-lg">
          <div class="px-8 pt-6 pb-12">
            <div class="text-center">
              <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
            </div>
            <v-card-title class="my-2">Sign in</v-card-title>
            <v-card-text>
              <p class="mb-5">To become a member of BYO.Tube, you will need a BYODA personal data server. Please sign up
                for a personal data server at <a href="https://byo.host/" class="text-primary text-decoration-none">BYO.Host</a> </p>
              <BaseForm ref="signinForm">
                <form @submit.prevent="signin">
                  <BaseTextfield v-model="signinData.email" color="primary" name="Username" rules="required" label="Username" variant="outlined">
                  </BaseTextfield>

                  <p class="ma-0 text-right">
                    <BaseBtn variant="text" small class="pl-0 text-capitalize" color="primary" href="true">Forget
                      Password?</BaseBtn>
                  </p>
                  <BaseTextfield v-model="signinData.password" color="primary" name="Password" rules="required"  type="password" label="Password"
                    variant="outlined"></BaseTextfield>
                  <BaseTextfield v-model="signinData.domain" color="primary" name="Domain"  :rules="{ regex:/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}/}"  label="Domain" variant="outlined"
                    class="mt-3"></BaseTextfield>
                  <div class="mt-2 d-flex justify-space-between white-text">
                    <BaseBtn type="submit" block class="bg-primary elevation-0" :loading="loader" depressed>Sign in</BaseBtn>
                  </div>
                  <p class="pl-0 mb-2 mt-3">Don't have an account? <span
                        class="text-primary cursor-pointer" @click="$router.push({ name: 'AccountOptions' })">Signup</span>
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
import { BaseBtn, BaseTextfield, BaseForm } from '@/components/base';
import { useSignin } from './useSignin';

const { signinForm, loader, signinData, signin } = useSignin()

</script>

<style lang="scss">
.white-text {
  .v-btn__content {
    color: white !important;
  }
}
</style>
