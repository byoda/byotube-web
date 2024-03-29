import { useAlert, useLoader } from "@/composables";
import { useAuthService } from "@/services";
import { ref } from "vue";

export const useSignup = () => {

  const { showError } = useAlert();
  const { loader, showLoader, hideLoader } = useLoader();
  const { createAccountLite } = useAuthService()

  const signupForm = ref()

  const signupData = ref({
    email:null,
    password:null,
    confirmPassword:null,
    handle:null
  })

  const signup = async () => {
    showLoader();
    const accountData = { ...signupData.value };
    delete accountData.confirmPassword
    try {
      showLoader();
      const { valid } = await signupForm.value?.validate();
      if (!valid) return;
      await createAccountLite(accountData)

    } catch (error) {
      if (error) {
        const { detail } = error.response.data;
        showError(detail);
      }
    } finally {
      hideLoader();
    }
  };

  return {
    signupData,
    signupForm,
    signup
  };
};
