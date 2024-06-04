<template>
    <BaseDialog :name="name" :width="payoutInfo ? 900 : 500">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <template v-if="payoutInfo">
                    <div>
                        <h2>
                           Status for the payout of ${{ centsToDollars(payoutInfo?.amount_in_smallest_currency_unit)
                            }}  {{ payoutInfo.status }}
                        </h2>

                    </div>
                    <v-data-table :headers="headers" :items-per-page="15" :items="payoutInfo?.history"
                        density="comfortable" hide-default-footer>
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
                        <BaseBtn variant="text" color="primary" class="mr-2" @click="CloseDialog(name)">
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
                        Pay-out not found. Please contact payouts@byo.tube
                    </p>
                    <div class="text-end mt-2">
                        <BaseBtn variant="text" color="primary" class="mr-2" @click="CloseDialog(name)">
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
import { useDate } from "vuetify/lib/framework.mjs";

const props = defineProps({
    payoutInfo: {
        type: Object,
        default: null
    }
})

const name = 'payout-info-dialog'
const { CloseDialog } = useCoreStore()
const { toQueryString, basisPointsToPercentage, centsToDollars, addTrailingCommas } = useHelper()

const { format, fullDate } = useDate()

const headers = [
    {
        title: "Date",
        key: "timestamp",
        align: "center",
        sortable: false,
        width: "100",
    },
    {
        title: "Payout Status",
        key: "payout_status",
        align: "start",
        sortable: false,
        width: "100px",
    },
    {
        title: "Payout Provider Status",
        align: "start",
        sortable: false,
        key: "payout_provider_status",
        width: "150px",
    },
    {
        title: "Payout Id",
        key: "payout_id",
        align: "start",
        sortable: false,
        width: "200px",
    },
];



</script>