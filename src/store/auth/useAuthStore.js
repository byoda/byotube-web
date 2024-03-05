import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _auth = ref(false);

  const setAuth = (val) => {
    _auth.value = val;
  };

  const isAuthenticated = computed(() => {
    return _auth.value;
  });

  return {
    isAuthenticated,
    setAuth,
  };
});
