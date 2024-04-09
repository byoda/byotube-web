<template>
  <div>
    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" xs="12" sm="9" md="9" lg="9" class="ma-auto shadow-smooth">
          <v-card class="rounded-lg pa-5" outlined :loading="loading">
            <div class="text-center">
              <img src="@/assets/byotube-logo.png" :width="300" alt="" srcset="">
            </div>
            <p class="mt-4 text-center">
              Review features of the different BYO.Tube account types, check out the feature matrix
            </p>
            <v-col cols="12">
              <v-data-table :headers="headers" items-per-page="15" :items="rows" density="comfortable">
                <template #header.liteFunded>
                  <div class="text-center">
                    <p>
                      Lite - funded
                      <v-tooltip activator="parent" :text="liteFundedTooltip" location="top">
                      </v-tooltip>
                    </p>
                  </div>
                </template>
                <template #header.anonymous="{ column }">
                  <div class="text-center">
                    <p>
                      {{ column.title }}
                    </p>
                  </div>
                </template>
                <template #header.lite="{ column }">
                  <div class="text-center">
                    <p>
                      {{ column.title }}
                    </p>
                  </div>
                </template>
                <template #header.plain="{ column }">
                  <div class="text-center">
                    <p>
                      {{ column.title }}
                    </p>
                  </div>
                </template>
                <template #header.creator="{ column }">
                  <div class="text-center">
                    <p>
                      {{ column.title }}
                    </p>
                  </div>
                </template>
                <template #item.byotube="{ value }">
                  <div class="d-flex ga-2">
                    <p>
                      {{ value }}
                    </p>
                    <v-tooltip activator="parent" :text="getFeatureTooltip(value)" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">
                          mdi-information-slab-circle-outline
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
                <template #item.anonymous="{ value }">
                  <div class="text-center">
                    <v-chip :color="getIconColor(value)" rounded="circle" class="circle-chip" :pill="true">
                      <v-icon>
                        mdi-{{ getIcon(value) }}
                      </v-icon>
                      {{ getValue(value) }}
                    </v-chip>
                  </div>
                </template>
                <template #item.lite="{ value, item }">
                  <div class="text-center">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-tooltip v-if="value.includes('*')" activator="parent" :text="getContentTooltip(value, item)"
                      location="top">
                    </v-tooltip>
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                  </div>
                </template>
                <template #item.liteFunded="{ value }">
                  <div class="text-center">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                  </div>
                </template>
                <template #item.plain="{ value, item }">
                  <div class="text-center">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-tooltip v-if="value.includes('*')" activator="parent" :text="getContentTooltip(value, item)"
                      location="top">
                    </v-tooltip>
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                  </div>
                </template>
                <template #item.creator="{ value }">
                  <div class="text-center">
                  <v-chip :color="getIconColor(value)" class="circle-chip">
                    <v-icon>
                      mdi-{{ getIcon(value) }}
                    </v-icon>
                    {{ getValue(value) }}
                  </v-chip>
                  </div>
                </template>
                <template #bottom>
                  <div></div>
                </template>
                <template #body.append>
                  <tr>
                    <td></td>
                    <td width="50">
                      <BaseBtn block color="primary" class="white-text elevation-0" size="small" @click="openUrl('https://www.byo.tube/')">
                        Back to BYO.Tube
                      </BaseBtn>
                    </td>
                    <td colspan="2" width="50">
                      <BaseBtn block color="primary" class="white-text elevation-0" size="small" @click="$router.push({name:'SignUp', query:{'account-type':'lite'}})">
                        Get a Lite Account
                      </BaseBtn>
                    </td>
                    <td colspan="2" width="50">
                      <BaseBtn block color="primary" class="white-text elevation-0" size="small" @click="$router.push({name:'SignUp', query:{'account-type':'byotube'}})">
                        Get a Byo.Tube Account
                      </BaseBtn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useAccountOptions } from './useAccountOptions.js';
import { BaseBtn } from '@/components/base';

const { liteFundedTooltip, rows, headers, getIcon, getIconColor, getValue, getFeatureTooltip, getContentTooltip, openUrl } = useAccountOptions()
</script>

<style lang="scss" scoped>
.circle-chip {
  padding: 6px !important;
}
</style>