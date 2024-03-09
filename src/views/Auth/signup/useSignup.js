import { useAlert, useLoader } from "@/composables";
import { useAuthService } from "@/services";
import { useAuthStore } from "@/store";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useSignup = () => {
  const router = useRouter();

  const authStore = useAuthStore();

  const { showError } = useAlert();
  const { loader, showLoader, hideLoader } = useLoader();
  const { signIn: signinReq } = useAuthService();

  const getIconColor = (val) => {
    return val.includes("Yes") ? "green" : "red";
  };

  const getIcon = (val) => {
    return val.includes("Yes") ? "check" : "close";
  };

  const getValue = (val) => {
    return val.includes("Yes") ? val.replace("Yes", "") : val.replace("No", "");
  };

  return {
    getIconColor,
    getIcon,
    getValue,
  };
};
