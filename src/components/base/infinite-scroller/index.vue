<template>
    <v-infinite-scroll>
        <template v-for="(slot, index) in Object.keys($slots)" :key="index" v-slot:[slot]="slotProps">
            <slot :key="index" :name="slot" v-bind="slotProps"></slot>
        </template>

        <template #error="{ props }">
            <v-alert type="error">
                <div class="d-flex justify-space-between align-center">
                    Something went wrong...
                    <BaseBtn color="white" size="small" variant="outlined" v-bind="props">
                        Retry
                    </BaseBtn>
                </div>
            </v-alert>
        </template>

        <template #empty>
            <v-alert type="warning">No more items!</v-alert>
        </template>
    </v-infinite-scroll>
</template>

<script setup>
import { BaseBtn } from '..';

</script>

<style lang="scss">

</style>