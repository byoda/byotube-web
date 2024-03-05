<template>
    <!-- <form> -->
      <slot></slot>
    <!-- </form> -->
  </template>
  
  <script lang="ts" setup>
  import { useForm } from "vee-validate";
  
  const { validate, resetForm, errors, validateField } = useForm();
  
  defineExpose({
    validate,
    validateField,
    resetForm
  })
  

  </script>
  
  <style lang="scss" scoped>
  
  </style>