<template>
    <div class="pa-5 mx-auto pt-10" :class="{ 'w-75': !smAndDown }">
        <div class="bg-white pa-5 border rounded-lg px-8 pb-9">
            <BaseForm ref="registerForm">
                <h1>
                    Settings
                </h1>
                <div v-if="userInfo?.avatar_url" class="d-flex justify-center">
                    <img class="profile-img" height="100" :src="userInfo.avatar_url" rounded="circle" alt="" srcset="" />
                </div>
                <v-row class="mt-6">
                    <v-col cols="12" md="6" class="pt-0">
                        <BaseTextfield v-model="userInfo.nick" color="primary" density="comfortable" name="email"
                            rules="required" label="Nickname" variant="outlined">
                        </BaseTextfield>
                    </v-col>
                    <v-col cols="12" md="6" class="pt-0">
                        <v-file-input v-if="isByotubeAccount" v-model="files" label="Avatar" multiple variant="outlined"
                            density="comfortable" color="primary"></v-file-input>
                    </v-col>
                    <v-col cols="12" md="6" class="pt-0">
                        <v-switch v-model="userInfo.show_external_assets" hide-details inset
                        color="primary" label="Show external videos"></v-switch>
                    </v-col>
                    <div class="d-md-flex justify-end w-100 pr-3 mt-2">
                        <BaseBtn color="primary" :block="smAndDown" class="mt-2 white-text elevation-0"
                            @click="isBtLiteAccount ? updateLiteUserData(userInfo) : updateUserData(userInfo)">
                            Save
                        </BaseBtn>
                    </div>
                </v-row>
            </BaseForm>
        </div>
    </div>
</template>

<script setup>
import { BaseBtn, BaseTextfield, BaseForm } from '@/components/base';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useSettings } from './useSettings';
import { useAuthStore } from '@/store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useAuthService } from '@/services';

const { isBtLiteAccount, isByotubeAccount } = storeToRefs(useAuthStore())
const { smAndDown } = useDisplay()
const { userInfo, files, user, uploaImage, updateUserData, updateLiteUserData } = useSettings()
const { getLiteUserData, getPodUserData } = useAuthService()

const domain = localStorage.getItem('domain')

onMounted(async () => {
    if (domain != 'null') {
        const { data: userData } = await getPodUserData(domain);
        localStorage.setItem('user', JSON.stringify(userData?.edges[0].node))
        userInfo.value = userData?.edges[0].node
    } else {
        const { data: userData } = await getLiteUserData();
        localStorage.setItem('user', JSON.stringify(userData))
        userInfo.value = userData
    }
})

</script>

<style lang="scss">
.primary-border {
    border: 1px solid #f29616b6;
    border-radius: 4px;
}


.profile-img{
    object-fit: contain;
    border-radius: 50%;
}
</style>