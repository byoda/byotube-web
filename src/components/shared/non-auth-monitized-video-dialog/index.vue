<template>
    <BaseDialog :name="nonAuthMonitizedVideoDialog" width="auto" :close-on-back="true">
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
                   <BaseBtn variant="tonal" color="success" @click="moveToSigninPage">
                       SignIn
                   </BaseBtn>
               </div>
           </BaseCard>
       </template>
   </BaseDialog>
</template>

<script setup>
import { BaseBtn, BaseDialog, BaseCard } from '@/components/base'
import { useCoreStore } from '@/store';
import { useRoute, useRouter } from "vue-router";

const router = useRouter()
const route = useRoute()
const assetId = route.query?.asset_id
const memberId = route.query?.member_id

const nonAuthMonitizedVideoDialog = 'nonAuthMonitizedVideoDialog'
const { CloseDialog,  } = useCoreStore()

const moveToSigninPage = () => {
    router.push({name:'SignIn', query:{asset_id:assetId, member_id: memberId}})
}

window.onpopstate = (event) => {
    CloseDialog(nonAuthMonitizedVideoDialog)
    window.onpopstate = () =>{}
}
</script>

<style lang="scss" scoped>

</style>