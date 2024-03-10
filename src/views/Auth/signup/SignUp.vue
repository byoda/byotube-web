<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" xs="12" sm="8" md="8" lg="7" class="ma-auto shadow-smooth">
        <v-card class="rounded-lg pa-5" outlined :loading="loading">
          <div class="text-center pt-7">
            <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
          </div>
          <v-row class="justify-space-between px-4 pt-6 pb-12">
            <v-col cols="12">
              <v-data-table :headers="headers" :items="rows">
                <template #header.liteFunded>
                  <p>
                    Lite - funded(*)
                    <v-tooltip activator="parent" :text="liteFundedTooltip" location="top">
                    </v-tooltip>
                  </p>
                </template>
                <template #item.byotube="{ value }">
                  <div class="d-flex ga-2">
                    <p>
                      {{ value }}
                    </p>
                    <v-tooltip activator="parent" :text="getFeatureTooltip(value)" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">
                          mdi-information-slab-circle-outline
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
                <template #item.anonymous="{ value }">
                  <v-chip :color="getIconColor(value)" rounded="circle" class="circle-chip" :pill="true">
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                </template>
                <template #item.lite="{ value, item }">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-tooltip v-if="value.includes('*')" activator="parent" :text="getContentTooltip(value, item)" location="top">
                    </v-tooltip>
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                </template>
                <template #item.liteFunded="{ value }">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                </template>
                <template #item.plain="{ value, item }">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-tooltip v-if="value.includes('*')" activator="parent" :text="getContentTooltip(value, item)" location="top">
                    </v-tooltip>
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                </template>
                <template #item.creator="{ value }">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                </template>
                <template #bottom>
                  <div></div>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12">
              <v-card-subtitle class="mb-5">Create your VueTube account</v-card-subtitle>
              <v-card-text>
                <form @submit.prevent="handleSubmit(signUp)" @reset.prevent="reset">
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <BaseTextfield v-model="email" :error-messages="errors" label="Email" color="primary" name="Email"
                        class="mb-3" variant="outlined" />
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <BaseTextfield v-model="channelName" label="Channel Name" name="Channel Name" color="primary"
                        variant="outlined" />
                    </v-col>
                    <v-col cols="12" md="6" class="py-0">
                      <BaseTextfield v-model="password" type="password" name="Password" label="Password" color="primary"
                        variant="outlined" />
                    </v-col>
                    <v-col cols="12" md="6" class="py-0">
                      <BaseTextfield type="password" v-model="confirmPassword" name="Confirm Password" color="primary"
                        label="Confirm Password" variant="outlined" />
                    </v-col>
                  </v-row>
                  <div class="mt-6">
                    <p class="pl-0 text-capitalize mb-2">Already have and account? <span
                        class="text-primary cursor-pointer" @click="$router.push({ name: 'SignIn' })">Signin</span> here
                    </p>
                    <BaseBtn block type="submit" class="bg-primary elevation-0 white-text" :loading="loading" depressed>
                      Sign up
                    </BaseBtn>
                  </div>
                </form>
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
import { useSignup } from './useSignup';
import { BaseBtn, BaseTextfield } from '@/components/base';


const { liteFundedTooltip, rows, getIcon, getIconColor, getValue, getFeatureTooltip, getContentTooltip } = useSignup()

const email = ref('')
const channelName = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const headers = [
  {
    title: 'BYO.Tube',
    align: 'start',
    sortable: false,
    key: 'byotube',
    width: '180'
  },
  { title: 'Anonymous', key: 'anonymous', align: 'center', width:'50' },
  { title: 'Lite', key: 'lite', align: 'center' },
  { title: 'Lite - funded(*)', key: 'liteFunded', align: 'center' },
  { title: 'BYODA-plain (g)', key: 'plain', align: 'center' },
  { title: 'BYODA-(Top) Creator (g)', key: 'creator', align: 'center' },
]




const signUp = async () => {
  loading.value = true

  // const data = await this.$store
  //   .dispatch('signUp', {
  //     email: email.value,
  //     channelName: channelName.value,
  //     password: password.value
  //   })
  //   .catch((err) => {
  //     loading.value = false
  //     const errors = err.response.data.error

  //     this.$refs.form.setErrors({
  //       'Email': errors.find((error) => {
  //         return error.field === 'email'
  //       })
  //         ? ['This email is already taken']
  //         : null,
  //       'Channel Name': errors.find((error) => {
  //         return error.field === 'channelName'
  //       })
  //         ? ['This channel name is already taken']
  //         : null
  //     })
  //   })

  if (!data) return

  if (!user) return
  loading.value = false
  this.$router.push({ name: 'Home' })
}
</script>

<style scoped>
.circle-chip {
  padding: 6px !important;
}
</style>
