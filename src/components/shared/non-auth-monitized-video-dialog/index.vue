<template>
    <BaseDialog :name="nonAuthMonitizedVideoDialog" width="auto" persistent>
       <template #default="{ isActive }">
           <BaseCard class="pa-8 rounded-xl">
            <div class="d-flex align-center justify-center">
                    <div class="pa-3 bg-blue-lighten-4 rounded-circle">
                        <v-icon color="blue-lighten-1" icon="mdi-shield-alert-outline" size="80"></v-icon>
                    </div>
                </div>
               <p class="text-center text-grey-darken-3 mt-4">
                   This video requires you to be logged in and have burst points.
               </p>
               <div class="d-flex justify-center py-5 ga-3">
                   <BaseBtn variant="tonal" color="success" @click="router.push({ name: 'SignIn' })">
                       SignIn
                   </BaseBtn>
               </div>
           </BaseCard>
       </template>
   </BaseDialog>
</template>

<script setup>
import { BaseBtn, BaseDialog, BaseCard } from '@/components/base'
import { useRouter } from "vue-router";

const router = useRouter()

const nonAuthMonitizedVideoDialog = 'nonAuthMonitizedVideoDialog'

</script>

<style lang="scss" scoped>

</style>