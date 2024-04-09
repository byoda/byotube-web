import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _auth = ref(false);
  const _accountType = ref();

  const setAuth = (val) => {
    _auth.value = val;
  };

  const setAccountType = (val) => {
    _accountType.value = val;
  };

  const isAuthenticated = computed(() => {
    return _auth.value;
  });

  const isBtLiteAccount = computed(() => {
    return _accountType.value === "bt-lite"
  });

  return {
    isAuthenticated,
    isBtLiteAccount,
    setAuth,
    setAccountType,
  };
});
