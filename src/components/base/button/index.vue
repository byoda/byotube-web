<template>
  <v-btn>
    <template v-for="(slot, index) in Object.keys($slots)" :key="index" v-slot:[slot]="slotProps">
      <slot :key="index" :name="slot" v-bind="slotProps"></slot>
    </template>
  </v-btn>
</template>
 
<script setup>

</script>
 
<style lang="scss" scoped></style>