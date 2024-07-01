<template>
    <BaseDialog :name="nonFundedDialog" width="auto">
        <template #default="{ isActive }">
            <BaseCard class="pa-8 rounded-xl">
                <div class="d-flex align-center justify-center">
                    <div class="pa-3 bg-blue-lighten-4 rounded-circle">
                        <v-icon color="blue-lighten-1" icon="mdi-shield-alert-outline" size="80"></v-icon>
                    </div>
                </div>
                <p class="text-center text-grey-darken-3 mt-4">
                    This features requires you to have funded your account
                </p>
                <div class="d-flex justify-center py-5 ga-3">
                    <BaseBtn variant="tonal" color="error" @click="coreStore.CloseDialog(nonFundedDialog)">
                        Cancel
                    </BaseBtn>
                    <BaseBtn variant="tonal" color="success" @click="coreStore.CloseDialog(nonFundedDialog)">
                        Fund Now
                    </BaseBtn>
                </div>
            </BaseCard>
        </template>
    </BaseDialog>
</template>

<script setup>
import { BaseBtn, BaseDialog, BaseCard } from '@/components/base'
import { useCoreStore } from '@/store';

const coreStore = useCoreStore()

const nonFundedDialog = 'nonFundedDialog'

</script>

<style lang="scss" scoped></style>