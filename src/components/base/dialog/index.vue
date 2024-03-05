<template>
    <v-dialog v-model="show">
        <template #default>
            <slot/>
        </template>
        <template v-for="(slot, index) in Object.keys($slots)" :key="index" v-slot:[slot]="slotProps">
            <slot :key="index" :name="slot" v-bind="slotProps"></slot>
        </template>
    </v-dialog>
</template>
  
<script setup>
import { computed } from "@vue/reactivity"
import { useComponent } from "@/composables"
import { useSlots } from "vue";

const props = defineProps({
    name: {
        type: String,
        default: "",
    },
})

const { coreStore } = useComponent()
const slots = useSlots()

const show = computed(() => {
    return coreStore.getOpenedDialogs.indexOf(props.name) != -1
})


</script>
  