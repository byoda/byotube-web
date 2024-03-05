import { getCurrentInstance } from "vue";

export const useEmitter = () => {
  const internalInstance = getCurrentInstance();
  const emitter = internalInstance.appContext.config.globalProperties.emitter;

  return emitter;
};
