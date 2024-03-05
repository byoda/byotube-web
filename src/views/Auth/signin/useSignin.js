import { useAlert, useLoader } from "@/composables";
import { useAuthService } from "@/services";
import { useAuthStore } from "@/store";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useSignin = () => {
  const router = useRouter();

  const authStore = useAuthStore();

  const { showError } = useAlert();
  const { loader, showLoader, hideLoader } = useLoader();
  const { signIn: signinReq } = useAuthService();

  const signinForm = ref();

  const signinData = ref({
    email: null,
    password: null,
    domain: null,
    service_id: import.meta.env.VITE_BYOTUBE_SERVICE_ID,
  });

  const signin = async () => {
    showLoader();
    const { email, password, service_id, domain } = signinData.value;
    try {
      showLoader();
      const { valid } = await signinForm.value?.validate();
      if (!valid) return;

      const { data, status } = await signinReq(
        `https://${signinData.value.domain}/api/v1/pod/authtoken`,
        { username: email, password, service_id }
      );

      if (data && status == 200) {
        localStorage.setItem("token", data?.auth_token);
        localStorage.setItem("domain", signinData.value.domain);
        authStore.setAuth(true);
        router.push({ name: "Home" });
      }
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
    signinForm,
    loader,
    signinData,
    signin,
  };
};
