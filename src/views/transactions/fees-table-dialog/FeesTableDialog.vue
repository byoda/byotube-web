<template>
    <BaseDialog :name="name" width="800">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <div>
                    <h2>
                        Fees
                    </h2>

                </div>
                <v-data-table :headers="headers" :items-per-page="15" :items="fees" density="comfortable">
                </v-data-table>
                <div class="text-end mt-8">
                    <BaseBtn variant="text" color="red" class="mr-2" @click="CloseDialog(name)">
                        Cancel
                    </BaseBtn>
                    <BaseBtn class="bg-primary white-text elevation-0" @click="getPayout">
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
import { useTransactions } from "../useTransactions"
import { ref } from "vue";
import { usePaymentService } from "@/services";
import { useHelper } from "@/composables";

const props = defineProps({
    fees: {
        type: Array,
        default: null
    },
    points: {
        type: String,
        default: null
    }
})

const name = 'fees-dialog'
const { payout } = usePaymentService();
const { CloseDialog } = useCoreStore()
const { toQueryString } = useHelper()

const headers = [
    {
        title: "Description",
        key: "description",
        align: "center",
        sortable: false,
        width: "220",
    },
    {
        title: "Charged By",
        align: "start",
        sortable: false,
        key: "charged_by",
        width: "100px",
    },
    {
        title: "Percentage",
        align: "start",
        sortable: false,
        key: "percentage_basispoints",
        width: "40px",
    },
    {
        title: "Amount",
        align: "start",
        sortable: false,
        key: "amount_in_smallest_currency_unit",
        width: "60px",
    },
];

const getPayout = async () => {
    try {
        const queryObj = {
            confirm: true,
            points: props.points
        }
        const query = toQueryString(queryObj)
        const { data } = await payout(query)
        CloseDialog(name)

    } catch (error) {
        console.error("Error", error)
    } finally {
    }
}



</script>