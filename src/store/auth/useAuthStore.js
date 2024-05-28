import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _auth = ref(false);
  const _accountType = ref();
  const _funded = ref(false)

  const setAuth = (val) => {
    _auth.value = val;
  };

  const setFunded = (val) => {
    _funded.value = val;
  };

  const setAccountType = (val) => {
    _accountType.value = val;
  };

  const isAuthenticated = computed(() => {
    return _auth.value;
  });

  const isBtLiteAccount = computed(() => {
    return _accountType.value === "btlite"
  });

  const isByotubeAccount  = computed(() => {
    return _accountType.value === "byotube"
  });

  const isFunded = computed(() => {
    return _funded.value
  });

  return {
    isAuthenticated,
    isBtLiteAccount,
    isFunded,
    isByotubeAccount,
    setAuth,
    setAccountType,
    setFunded
  };
});
