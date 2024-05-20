<template>
  <div class="w-75 pa-5 mx-auto shadow-smooth pt-10">
    <v-card>
      <v-data-table :headers="headers" items-per-page="15" :items="transactions" density="comfortable">
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
        <!-- <template #item.timestamp="{ value }">
          <div>
            {{ date.format(value, "keyboardDate") }}  {{ value.substring(11,16) }}
          </div>
        </template>
        <template #item.timestamp="{ value }">
          <div>
            {{ date.format(value, "keyboardDate") }}  {{ value.substring(11,16) }}
          </div>
        </template>
        <template #item.timestamp="{ value }">
          <div>
            {{ date.format(value, "keyboardDate") }}  {{ value.substring(11,16) }}
          </div>
        </template> -->
      </v-data-table>
    </v-card>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useTransactions } from "./useTransactions"
import { useDate } from 'vuetify'

const { headers, transactions, sources, transactionTypes, getAllTransactions } = useTransactions()

const date = useDate()


onMounted(async () => {
  await getAllTransactions()
})


</script>