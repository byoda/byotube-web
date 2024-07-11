<template>
  <v-text-field v-model="inputModelValue" :error="!!errorMessage" :error-messages="errorMessage && customError ? customError : errorMessage">
    <template #label>
      <p v-if="label" class="block text-sm font-medium   text-gray-700 mb-1">
        {{ label }}
        <span v-if="isRequired" class="text-red-accent-4">*</span>
      </p>
    </template>
    <template v-for="(slot, index) in Object.keys($slots)" :key="index" v-slot:[slot]="slotProps">
      <slot :key="index" :name="slot" v-bind="slotProps"></slot>
    </template>
  </v-text-field>
</template>

<script setup>
import { useField } from 'vee-validate';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: () => ('Input' + Math.floor(Math.random() * 5000)),
  },
  rules: {
    type: [String,Object],
    default: null
  },
  label: {
    type: String,
    default: null
  },
  customError:{
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const { value, errorMessage } = useField(() => props.name, props.rules);

const inputModelValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    value.value = val
    emit('update:modelValue', value.value)
  }
})

const isRequired = computed(() => props.rules?.includes?.('required') || props.rules?.['required'])

</script>

<style lang="scss" scoped></style>