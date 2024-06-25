<template>
    <div class="pa-5 mx-auto pt-10" :class="{'w-75' : !smAndDown}">
        <div class="bg-white pa-5 border rounded-lg px-8 pb-9">
            <BaseForm ref="registerForm">
                <h1>
                    Settings
                </h1>
                <v-row class="mt-6">
                    <v-col cols="12" md="6" class="pt-0">
                        <BaseTextfield v-model="userInfo.nickname" color="primary" density="comfortable"
                            name="email" rules="required" label="Nickname" variant="outlined">
                        </BaseTextfield>
                    </v-col>
                    <v-col cols="12" md="6" class="pt-0">
                        <v-file-input v-model="file" label="Avatar" variant="outlined" density="comfortable" color="primary"></v-file-input>
                    </v-col>
                    <div class="d-md-flex justify-end w-100 pr-3 mt-2">
                        <BaseBtn color="primary" :block="smAndDown" class="mt-2 white-text elevation-0"
                            @click="uploaImage">
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

const { smAndDown } = useDisplay()
const { userInfo, file, uploaImage } = useSettings()


</script>

<style lang="scss">
.primary-border{
    border: 1px solid #f29616b6;
    border-radius: 4px;
}
</style>