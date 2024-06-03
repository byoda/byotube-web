<template>
    <BaseDialog :name="name" :width="purchaseInfo ? 900 : 500">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <template v-if="purchaseInfo">
                    <h2>
                        Payment details
                    </h2>
                    <v-data-table :headers="headers" :items-per-page="15" :items="[purchaseInfo]" density="comfortable"
                        hide-default-footer>
                        <template #bottom>
                            <div></div>
                        </template>
                        <template #item.timestamp="{ value }">
                            <p>
                                {{ value?.slice(0, 10) }}
                            </p>
                        </template>

                    </v-data-table>
                    <div class="text-end mt-8">
                        <BaseBtn variant="text" color="red" class="mr-2" @click="CloseDialog(name)">
                            Close
                        </BaseBtn>
                    </div>
                </template>
                <template v-else>
                    <div class="d-flex align-center justify-center">
                        <div class="pa-3 bg-red-lighten-4 rounded-circle">
                            <v-icon color="red-lighten-1" icon="mdi-shield-alert-outline" size="60"></v-icon>
                        </div>
                    </div>
                    <p class="font-weight-medium text-center text-h6 mt-4">
                        Purchase not found. Please contact payouts@byo.tube
                    </p>
                    <div class="text-end mt-2">
                        <BaseBtn variant="text" color="red" class="mr-2" @click="CloseDialog(name)">
                            Close
                        </BaseBtn>
                    </div>

                </template>
            </BaseCard>
        </template>
    </BaseDialog>
</template>

<script setup>
import { BaseDialog, BaseCard, BaseBtn } from "@/components/base"
import { useCoreStore } from "@/store";
import { useHelper } from "@/composables";

const props = defineProps({
    purchaseInfo: {
        type: Object,
        default: null
    }
})

const name = 'payment-info-dialog'
const { CloseDialog } = useCoreStore()
const { toQueryString, basisPointsToPercentage, centsToDollars, addTrailingCommas } = useHelper()


const headers = [

    {
        title: "Status",
        key: "status",
        align: "start",
        sortable: false,
        width: "100px",
    },
    {
        title: "Payment Provider Status",
        align: "start",
        sortable: false,
        key: "provider_payment_status",
        width: "150px",
    },
    {
        title: "Payment Provider",
        align: "start",
        sortable: false,
        key: "payment_provider",
        width: "150px",
    },
    {
        title: "Payment Id",
        key: "payment_id",
        align: "start",
        sortable: false,
        width: "220px",
    },
];



</script>