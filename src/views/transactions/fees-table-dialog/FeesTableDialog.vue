<template>
    <BaseDialog :name="name" width="800">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <div>
                    <h2>
                        Fees for payout of ${{ centsToDollars(fees?.amount_in_smallest_currency_unit) }} for {{
        addTrailingCommas(points)
    }} Burst points
                    </h2>

                </div>
                <v-data-table :headers="headers" :items-per-page="15" :items="fees?.fees" density="comfortable"
                    hide-default-footer>
                    <template #bottom>
                        <div></div>
                    </template>
                    <template #item.percentage_basispoints="{ value }">
                        <p>
                            {{ basisPointsToPercentage(value) }}%
                        </p>
                    </template>
                    <template #item.amount_in_smallest_currency_unit="{ value }">
                        <p>
                            ${{ centsToDollars(value) }}
                        </p>
                    </template>
                    <template #body.append>
                        <tr>
                            <td>
                                <p class="font-weight-medium text-body-2">
                                    Total esitmated proceeds
                                </p>
                            </td>

                            <td colspan="2" width="50">

                            </td>
                            <td colspan="2" width="50">
                                <p class="font-weight-medium">
                                    ${{ centsToDollars(fees?.estimated_payout_in_smallest_currency_unit) }}
                                </p>
                            </td>
                        </tr>
                    </template>
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
import { BaseDialog, BaseCard, BaseBtn } from "@/components/base"
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
const { toQueryString, basisPointsToPercentage, centsToDollars, addTrailingCommas } = useHelper()

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