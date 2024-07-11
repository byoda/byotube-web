<template>
    <BaseDialog :name="name" width="1000">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <div>
                    <p>
                        Please review your Stripe Connect account on the Stripe website. If you have any questions,
                        please reach out
                        to payouts@byo.tube.
                    </p>

                </div>
                <v-data-table :headers="headers" :items-per-page="15" class="mt-4" :items="[registerData]" density="comfortable"
                    hide-default-footer>
                    <template #bottom>
                        <div></div>
                    </template>
                </v-data-table>
                <div class="text-end mt-8">
                    <BaseBtn variant="tonal" color="red" class="mr-2" @click="CloseDialog(name)">
                        Close
                    </BaseBtn>
                </div>
            </BaseCard>
        </template>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, BaseCard, BaseBtn } from "@/components/base"
import { useCoreStore } from "@/store";
import { useHelper } from "@/composables";

const props = defineProps({
    registerData: {
        type: Array,
        default: null
    },
})

const name = 'review-registration-dialog'

const { CloseDialog } = useCoreStore()
const { toQueryString, } = useHelper()

const headers = [
    {
        title: "BYO.Tube Account",
        align: "start",
        sortable: false,
        key: "account_status",
        width: "150px",
    },
    {
        title: "Your email",
        align: "start",
        sortable: false,
        key: "email",
        width: "60px",
    },
    {
        title: "Stripe Connect Provider",
        key: "payout_provider",
        align: "center",
        sortable: false,
        width: "220",
    },
    {
        title: "Stripe Connect Account",
        key: "payout_provider_id",
        align: "center",
        sortable: false,
        width: "220",
    },
    {
        title: "Stripe Connect Account Status",
        align: "center",
        sortable: false,
        key: "payout_provider_status",
        width: "200px",
    },  
];

</script>