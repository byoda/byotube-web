<template>
  <v-app>
    <v-main class="bg-grey-lighten-5" >
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { useApp } from "@/composables"
import { onUnmounted } from "vue";
import { onMounted } from "vue";

const { setSessionIdLocalStorage, removeSessionIdLocalStorage, setAuthAccountType } = useApp()

onMounted(()=>{
  setSessionIdLocalStorage()
  setAuthAccountType()
})

onUnmounted(()=>{
  removeSessionIdLocalStorage()
})

</script>

<style lang="scss">
</style>

<style src="../src/assets/styles/main.scss" />
