import { useAlert, useBurstPoints, useLoader } from "@/composables";
import { useAuthService } from "@/services";
import { useAuthStore } from "@/store";
import { nextTick, ref, toRefs } from "vue";
import { useRouter } from "vue-router";

export const useSignin = () => {
  const router = useRouter();

  const { attestUserBurstPoints } = useBurstPoints()

  const { setAccountType, setAuth } = toRefs(useAuthStore());

  const { showError } = useAlert();
  const { loader, showLoader, hideLoader } = useLoader();
  const { signIn: signinReq } = useAuthService();

  const signinForm = ref();
  const accountType = ref('lite')
  const visible = ref(false)

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

   
      const url = signinData.value.domain
        ? `https://${signinData.value.domain}/api/v1/pod/authtoken`
        : "/lite/account/auth ";

      const { data, status } = await signinReq(url, {
        [`${signinData.value.domain ? 'username' : 'email'}`]: email,
        password,
        service_id,
      });

      if (data && status == 200) {
        localStorage.setItem("token", data?.auth_token);
        localStorage.setItem("domain", signinData.value.domain);
        setAuth.value(true);
        setAuthAccountType();
        await nextTick()
        await attestUserBurstPoints()
        router.push({ name: "Home" });
      }
    } catch (error) {
      console.log("Erre", error);
      if (error) {
        const { detail } = error?.response?.data;
        showError(detail);
      }
    } finally {
      hideLoader();
    }
  };

  const setAuthAccountType = () => {
    if (!signinData.value.domain) {
      localStorage.setItem("account", "btlite");
      setAccountType.value("btlite");
    }else{
      localStorage.setItem("account", "byotube");
      setAccountType.value("byotube");
    }
  };

  return {
    signinForm,
    loader,
    signinData,
    accountType,
    visible,
    signin,
  };
};
