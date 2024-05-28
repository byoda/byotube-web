<template>
  <div class="w-75 pa-5 mx-auto pt-10">
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
          <BaseBtn color="black" density="comfortable" @click="$router.push({name: 'Payment'})">
            Buy more
          </BaseBtn>
          <BaseBtn v-if="isRegisterVisible" color="primary" density="comfortable" class="mt-2 white-text" @click="$router.push({name: 'GetPaid'})">
            Register
          </BaseBtn>
          <BaseBtn density="comfortable" class="mt-2 white-text bg-primary" @click="OpenDialog(payoutDialogName)">
            Payout
          </BaseBtn>
        </div>
    </div>
    <div class="shadow-smooth mt-10">
      <v-card>
        <v-data-table :headers="headers" :loading="tableLoader" items-per-page="15" :items="transactions" density="comfortable">
          <template #header.liteFunded>
            <div class="text-center">
              <p>
                Lite - funded
                <v-tooltip activator="parent" :text="liteFundedTooltip" location="top">
                </v-tooltip>
              </p>
            </div>
          </template>
          <template #item.timestamp="{ value }">
            <div>
              {{ date.format(value, "keyboardDate") }}  {{ value.substring(11,16) }}
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
          <template #item.transaction_type="{ value }">
            <div>
              {{ transactionTypes[value] }}
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
    <PayoutDialog />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useTransactions } from "./useTransactions"
import { useDate } from 'vuetify'
import { BaseBtn, BaseSpinner } from "@/components/base";
import { useHelper } from "@/composables";
import PayoutDialog from "./payout-dialog/PayoutDialog.vue"
import { useCoreStore } from "@/store";

const { OpenDialog } = useCoreStore()
const { headers, balance, loader, tableLoader, isRegisterVisible, transactions, sources, transactionTypes, getAllTransactions, getBalance } = useTransactions()
const { addTrailingCommas } = useHelper()

const date = useDate()

const payoutDialogName = 'payout-dialog'


onMounted(async () => {
   getAllTransactions()
   getBalance()
  
})


</script>

