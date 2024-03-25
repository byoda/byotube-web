<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="8" md="5" lg="4" class="ma-auto shadow-smooth">
        <v-card class="rounded-lg pa-5" outlined :loading="loading">
          <div class="text-center pt-7">
            <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
          </div>
          <v-row class="justify-space-between px-4 pt-6 pb-12">
            <v-col cols="12">
              <v-card-subtitle class="mb-5">Create your VueTube account</v-card-subtitle>
              <v-card-text>
                <BaseForm ref="signupForm">
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <BaseTextfield v-model="signupData.email" label="Email" color="primary" name="Email"
                        class="mb-1" variant="outlined" rules="required" />
                    </v-col>
                    <v-col cols="12">
                      <BaseTextfield v-model="signupData.handle" label="Channel Name" name="Channel Name" color="primary"
                        variant="outlined" rules="required" />
                    </v-col>
                    <v-col cols="12"  class="py-0">
                      <BaseTextfield v-model="signupData.password" type="password" name="Password" label="Password" color="primary"
                        variant="outlined" rules="required" />
                    </v-col>
                    <v-col cols="12" class="">
                      <BaseTextfield type="password" v-model="signupData.confirmPassword" name="Confirm Password" color="primary"
                        label="Confirm Password" variant="outlined" rules="confirmed:@Password" />
                    </v-col>
                  </v-row>
                  <div class="mt-6">
                    <p class="pl-0 mb-2">Already have an account? <span
                        class="text-primary cursor-pointer" @click="$router.push({ name: 'SignIn' })">Signin</span>
                    </p>
                    <BaseBtn block type="submit" class="bg-primary elevation-0 white-text" :loading="loading" depressed @click="signup">
                      Sign up
                    </BaseBtn>
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
import { BaseBtn, BaseForm, BaseTextfield } from '@/components/base';
import { useSignup } from './useSignup';

const loading = ref(false)

const { signupData, signupForm, signup } = useSignup()

</script>

<style scoped>

</style>
