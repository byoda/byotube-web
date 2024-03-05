import { computed, ref } from "vue";
export const useLoader = () => {
  const _loading = ref(false);

  const showLoader = () => {
    _loading.value = true;
  };

  const hideLoader = () => {
    _loading.value = false;
  };

  const loader = computed(() => _loading.value);

  return {
    loader,
    showLoader,
    hideLoader,
  };
};
