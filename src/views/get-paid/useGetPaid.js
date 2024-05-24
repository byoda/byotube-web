import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useLoader } from "@/composables";
import { usePaymentService } from "@/services";

export const useGetPaid = () => {

  const { registerInStripe } = usePaymentService()

  const router = useRouter();
  const route = useRoute();

  const { loader, showLoader, hideLoader } = useLoader();

  const registerForm = ref()

  const accountDetails = ref({
    email: null,
    first_name: null,
    last_name: null,
    business_name: null,
    country: null,
  });

  const register = async () => {
    try {
      const { valid }  = await registerForm.value.validate()
      if(!valid) return
      await registerInStripe(accountDetails.value)
    } catch (error) {
      console.error("Error", error)
    }
  }

  return {
    registerForm,
    accountDetails,
    register
  };
};
