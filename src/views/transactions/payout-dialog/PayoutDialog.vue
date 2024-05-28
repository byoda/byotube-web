<template>
    <BaseDialog :name="name" width="500">
        <template #default>
            <BaseCard class="pa-8 rounded-xl">
                <h2>
                    Payout
                </h2>
                <p class="mb-5 font-weight-medium">
                    Enter how many points you want to payout.
                </p>
                <BaseTextfield v-model="points" variant="outlined" label="Points" />
                <div class="text-end">
                    <BaseBtn variant="text" color="red" class="mr-2" @click="CloseDialog(name); points = null">
                        Cancel
                    </BaseBtn>
                    <BaseBtn class="bg-primary white-text elevation-0" @click="getPayout(points)">
                        Ok
                    </BaseBtn>
                </div>
            </BaseCard>
        </template>
    </BaseDialog>
    <FeesDialog :fees="fees" :points="pointsForFees" />
</template>

<script setup>
import { BaseDialog, BaseCard, BaseTextfield, BaseBtn } from "@/components/base"
import { useCoreStore } from "@/store";
import { useTransactions } from "../useTransactions"
import { ref } from "vue";
import { usePaymentService } from "@/services";
import { useHelper } from "@/composables";
import FeesDialog from "../fees-table-dialog/FeesTableDialog.vue"

const { payout } = usePaymentService();
const { toQueryString } = useHelper()
const { OpenDialog, CloseDialog } = useCoreStore()

const name = 'payout-dialog'
const feesDialog = 'fees-dialog'

const points = ref('')
const pointsForFees = ref('')
const fees = ref(null)

const getPayout = async (pointsVal) => {
    try {
        const queryObj = {
            confirm: false,
            points: pointsVal
        }
        const query = toQueryString(queryObj)
        const { data } = await payout(query)
        fees.value = data.fees
        pointsForFees.value = points.value
        OpenDialog(feesDialog)
        CloseDialog(name)
        points.value = null
    } catch (error) {
        console.error("Error", error)
    } finally {
    }
}
</script>