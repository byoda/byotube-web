<template>
    <BaseDialog :name="name" width="500">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <h2>
                    Move to Stripe
                </h2>
                <p class="mb-5 font-weight-medium">
                    You will now continue on the website of our pay-out provider Stripe to complete you registration
                </p>
                <BaseTextfield v-model="points" variant="outlined" label="Points" />
                <div class="text-end">
                    <BaseBtn variant="text" color="red" class="mr-2" @click="CloseDialog(name)">
                        Cancel
                    </BaseBtn>
                    <BaseBtn class="bg-primary white-text elevation-0" @click="moveToStripe">
                        Ok
                    </BaseBtn>
                </div>
            </BaseCard>
        </template>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, BaseCard, BaseTextfield, BaseBtn } from "@/components/base"
import { useCoreStore } from "@/store";
import { ref } from "vue";

const props = defineProps({
    url: {
        type: String,
        default: null
    }
})

const { OpenDialog, CloseDialog } = useCoreStore()

const name = 'stripe-redirect-dialog'

const moveToStripe = () => {
    window.open(props.url, '_self')

}
</script>