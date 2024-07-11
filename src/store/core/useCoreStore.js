import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

export const useCoreStore = defineStore("core", () => {
  const { mdAndUp } = useDisplay();

  const _drawer = ref(mdAndUp.value ? true : false);
  const fundedDialog = ref(false)

  const setDrawer = (val) => {
    _drawer.value = val;
  };

  const isDrawerOpen = computed({
    get() {
      return _drawer.value;
    },
    set(value) {
      _drawer.value = value;
    },
  });

  let _OpenedDialogs = ref([]);

  const getOpenedDialogs = computed(() => {
    return _OpenedDialogs.value;
  });

  const OpenDialog = (val) => {
    _OpenedDialogs.value.push(val);
  };
  const CloseDialog = (val) => {
    const ind = _OpenedDialogs.value.indexOf(val);
    if (ind >= 0) {
      _OpenedDialogs.value.splice(ind, 1);
    }
  };

  const EmptyDialogs = () => {
    _OpenedDialogs.value = []
  }

  const filter = ref({ name: "All", value: "" })

  const getFilter = computed(()=>{
    return filter.value
  })

  return {
    isDrawerOpen,
    getOpenedDialogs,
    fundedDialog,
    getFilter,
    filter,
    setDrawer,
    OpenDialog,
    CloseDialog,
    EmptyDialogs, 
  };
});
