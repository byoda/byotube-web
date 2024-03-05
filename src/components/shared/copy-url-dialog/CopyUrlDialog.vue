<template>
    <BaseDialog :name="copyUrlDialog" width="500">
        <template #default="{ isActive }">
            <BaseCard class="pa-8 rounded-xl">
                <div class="text-end">
                    <v-icon class="cursor-pointer" color="grey-darken-1" icon="mdi-close-circle-outline" size="30" @click="CloseDialog(copyUrlDialog)"></v-icon>
                </div>
                <div class="d-flex align-center justify-center">
                    <div class="pa-5 bg-blue-lighten-4 rounded-circle">
                        <v-icon color="blue-lighten-1" icon="mdi-content-copy" size="60"></v-icon>
                    </div>
                </div>
                <div class="d-flex align-center py-5 ga-3">
                    <BaseTextfield :model-value="url" hide-details density="compact" color="primary" variant="outlined" label="Url" name="Copy" />
                    <div id="copy-button">
                        <BaseBtn variant="tonal" color="primary" @click="copyLinkToClipboard(url)" @mouseenter="copy=false">
                            Copy
                            <v-tooltip attach="#copy-button" activator="parent" location="top" :text="copy ? 'Copied!' : 'Copy Url'">
                            </v-tooltip>
                        </BaseBtn>
                    </div>
                </div>
            </BaseCard>
        </template>
    </BaseDialog>
</template>

<script setup>
import { BaseBtn, BaseDialog, BaseCard, BaseTextfield } from '@/components/base'
import { useCoreStore } from '@/store';
import { toRefs } from 'vue';
import { ref } from 'vue';

const props = defineProps({
    url:{
        default:null,
        type:String
    }
})

const { CloseDialog } = toRefs(useCoreStore())

const copyUrlDialog = 'copyUrlDialog'

const copy = ref('')

const copyLinkToClipboard = async (val) => {
    await navigator.clipboard.writeText(val);
    copy.value = true;
};

</script>

<style lang="scss" scoped></style>