import { useAlert, useLoader } from "@/composables";
import { useAuthService } from "@/services";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useSignup = () => {
  const { showError, showSuccess, showErrorPopup } = useAlert();
  const { loader, showLoader, hideLoader } = useLoader();
  const { createAccountLite } = useAuthService();
  const router = useRouter();

  const signupForm = ref();
  const passwordVisible = ref(false)
  const confirmPasswordVisible = ref(false)

  const signupData = ref({
    email: null,
    password: null,
    confirmPassword: null,
    handle: null,
  });

  const signup = async () => {
    showLoader();
    const accountData = { ...signupData.value };
    delete accountData.confirmPassword;
    try {
      showLoader();
      const { valid } = await signupForm.value?.validate();
      if (!valid) return;
      await createAccountLite(accountData);
      showSuccess({
        text: "Account signup processed, please check your mailbox for a confirmation email from 'DoNotReply@byo.tube' to verify your email address",
        confirmButtonText: "Go to BYO.Tube",
      }).then(() => {
        router.push({ name: "Home" });
      });
    } catch (error) {
      if (error) {
        if(error?.response?.status === 429){
          showErrorPopup({text: 'Too many signup requests. Please wait 60 seconds before trying again'});
          return
        } 
        const { detail } = error.response.data;
        showError(detail);
      }
    } finally {
      hideLoader();
    }
  };

  return {
    loader,
    signupData,
    signupForm,
    passwordVisible,
    confirmPasswordVisible,
    signup,
  };
};
