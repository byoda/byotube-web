<template>
  <v-app>
    <v-main class="bg-grey-lighten-5" >
      <router-view></router-view>
      <NonFundedDialog />
    </v-main>
  </v-app>
</template>

<script setup>
import { useApp } from "@/composables"
import { onUnmounted } from "vue";
import { onMounted } from "vue";
import { NonFundedDialog } from "@/components/shared";

const { setSessionIdLocalStorage, removeSessionIdLocalStorage, setAuthAccountType, setAccountStatus } = useApp()

onMounted(()=>{
  setSessionIdLocalStorage()
  setAuthAccountType()
  setAccountStatus()
})

onUnmounted(()=>{
  removeSessionIdLocalStorage()
})

</script>

<style lang="scss">
</style>

<style src="../src/assets/styles/main.scss" />
