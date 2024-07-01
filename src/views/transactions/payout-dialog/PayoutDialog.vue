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
                <BaseTextfield v-model="points" type="number" hide-spin-buttons variant="outlined" label="Points" :error-messages="errorMessage" />
                <div class="text-end">
                    <BaseBtn variant="text" color="red" class="mr-2" @click="CloseDialog(name); points = null">
                        Cancel
                    </BaseBtn>
                    <BaseBtn class="bg-primary white-text elevation-0" :loading="loader" @click="getPayout(points)">
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
import { useHelper, useLoader } from "@/composables";
import FeesDialog from "../fees-table-dialog/FeesTableDialog.vue"

const { payout } = usePaymentService();
const { toQueryString } = useHelper()
const { OpenDialog, CloseDialog } = useCoreStore()
const { loader, showLoader, hideLoader } = useLoader()

const name = 'payout-dialog'
const feesDialog = 'fees-dialog'

const points = ref('')
const pointsForFees = ref('')
const fees = ref(null)
const errorMessage = ref('')

const getPayout = async (pointsVal) => {
    try {
        showLoader()
        const queryObj = {
            confirm: false,
            points: pointsVal
        }
        const query = toQueryString(queryObj)
        const { data } = await payout(query)
        fees.value = data
        pointsForFees.value = points.value
        OpenDialog(feesDialog)
        CloseDialog(name)
        points.value = null
    } catch (error) {
        console.error("Error", error)
        errorMessage.value = error.response?.data?.detail
    } finally {
        hideLoader()
    }
}
</script>