import { useCoreStore } from "@/store";

export const useComponent = () => {
  const coreStore = useCoreStore();

  return {
    coreStore,
  };
};
