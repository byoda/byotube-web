import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useLoader } from "@/composables";
import { usePaymentService } from "@/services";
import { useCoreStore } from "@/store";

export const useGetPaid = () => {

  const { registerInStripe } = usePaymentService()

  const router = useRouter();
  const route = useRoute();

  const { loader, showLoader, hideLoader } = useLoader();
  const { OpenDialog } = useCoreStore()

  const registerForm = ref()
  const stripeUrl = ref('')

  const accountDetails = ref({
    email: null,
    first_name: null,
    last_name: null,
    business_name: null,
    country: null,
  });

  const register = async () => {
    try {
      showLoader()
      const { valid }  = await registerForm.value.validate()
      if(!valid) return
      const { data } = await registerInStripe(accountDetails.value)
      window.open(data?.payout_provider_account_url, '_self')
    } catch (error) {
      console.error("Error", error)
    } finally {
      hideLoader()
    }
  }

  return {
    stripeUrl,
    loader,
    registerForm,
    accountDetails,
    register
  };
};
