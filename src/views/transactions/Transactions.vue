<template>
  <div class="pa-5 mx-auto pt-10" :class="{'w-75': mdAndUp}">
    <div class="bg-white pa-5 border rounded-lg px-8 d-flex justify-space-between">
      <div>
        <p class="text-body-2 text-grey-darken-3">
          Burst points
        </p>
        <BaseSpinner v-if="loader" color="black" class="mt-3" />
        <h1 v-else>
          {{ balance && addTrailingCommas(balance) }}
        </h1>
      </div>
      <div class="d-flex flex-column">
        <BaseBtn v-if="balance <= 20000" color="black" density="comfortable" @click="$router.push({ name: 'Payment' })">
          Buy more
        </BaseBtn>
        <BaseBtn v-if="isByotubeAccount && isRegisterVisible" color="primary" density="comfortable"
          class="mt-2 white-text" @click="$router.push({ name: 'GetPaid' })">
          Register for pay-outs
        </BaseBtn>
        <BaseBtn v-if="!isPayoutvisible && isByotubeAccount && !isRegisterVisible" color="primary" density="comfortable" class="mt-2 white-text"
          @click="OpenDialog(reviewDialogName)">
          Review registration
        </BaseBtn>
        <BaseBtn v-else-if="isPayoutvisible && isByotubeAccount && balance >= 10000 && !isRegisterVisible" density="comfortable" class="mt-2 white-text bg-primary" @click="OpenDialog(payoutDialogName)">
          Payout
        </BaseBtn>
      </div>
    </div>
    <div class="shadow-smooth mt-10">
      <v-card>
        <v-data-table :headers="headers" :loading="tableLoader" items-per-page="15" :items="transactions"
          density="comfortable">
          <template #header.liteFunded>
            <div class="text-center">
              <p>
                Lite - funded
                <v-tooltip activator="parent" :text="liteFundedTooltip" location="top">
                </v-tooltip>
              </p>
            </div>
          </template>
          <template #item.delta="{ value }">
            <div>
              {{ addTrailingCommas(value) }}
            </div>
          </template>
          <template #item.timestamp="{ value }">
            <div>
              {{ date.format(value, "keyboardDate") }} {{ value.substring(11, 16) }}
            </div>
          </template>
          <template #item.source_id="{ value }">
            <div>
              {{ sources[value] || 'You' }}
            </div>
          </template>
          <template #item.destination_id="{ value }">
            <div>
              {{ sources[value] || 'You' }}
            </div>
          </template>
          <template #item.transaction_type="{ value, item }">
            <div class="text-decoration-underline cursor-pointer" @click="value == 'payout' ? getPayoutInfo(item?.transaction_id) : getPurchaseInfo(item?.transaction_id)">
              {{ transactionTypes[value] }}
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <BaseDialog :name="reviewDialogName" width="500">
      <template #default>
        <BaseCard class="pa-8 rounded-xl">
          <p>
            Please review your Stripe Connect account on the Stripe website. If you have any questions, please reach out
            to payouts@byo.tube.
          </p>
          <div class="text-end mt-4">
            <BaseBtn color="red" class="mr-2 elevation-0" @click="CloseDialog(reviewDialogName)">
              Close
            </BaseBtn>
          </div>
        </BaseCard>
      </template>
    </BaseDialog>

    <PayoutDialog />
    <ReviewRegistrationDialog :register-data="account" />
    <PayoutInfoDialog :payout-info="payoutInfo" />
    <PurchaseInfoDialog :purchase-info="paymentInfo" />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useTransactions } from "./useTransactions"
import { useDate, useDisplay } from 'vuetify'
import { BaseBtn, BaseSpinner, BaseDialog, BaseCard } from "@/components/base";
import { useHelper } from "@/composables";
import PayoutDialog from "./payout-dialog/PayoutDialog.vue"
import ReviewRegistrationDialog from  "./review-regiatration-dialog/ReviewRegistrationDialog.vue"
import { useAuthStore, useCoreStore } from "@/store";
import { storeToRefs } from "pinia";
import PayoutInfoDialog from "./payout-info-dialog/PayoutInfoDialog.vue";
import PurchaseInfoDialog from "./purchase-info-dialog/PurchaseInfoDialog.vue";


const { isByotubeAccount } = storeToRefs(useAuthStore())
const { OpenDialog } = useCoreStore()
const { headers, balance, loader, tableLoader, isRegisterVisible, isPayoutvisible, account, transactions, sources, transactionTypes, payoutInfo, paymentInfo, getAllTransactions, getBalance, getAccountInfo, getPayoutInfo, getPurchaseInfo } = useTransactions()
const { addTrailingCommas } = useHelper()
const { mdAndUp } = useDisplay()

const date = useDate()

const payoutDialogName = 'payout-dialog'
const reviewDialogName = 'review-registration-dialog'


onMounted(async () => {
  getAllTransactions()
  getBalance()
  if(isByotubeAccount.value){
    getAccountInfo()
  }

})


</script>
