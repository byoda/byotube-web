import { useAlert, useBurstPoints, useLoader } from "@/composables";
import { constants } from "@/globals/constants";
import { useAuthService } from "@/services";
import { useAuthStore, useCoreStore } from "@/store";
import { nextTick, ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useSignin = () => {
  const router = useRouter();
  const route = useRoute();

  const { attestUserBurstPoints } = useBurstPoints();

  const { setAccountType, setAuth, isAuthenticated } = toRefs(useAuthStore());
  const coreStore = useCoreStore()

  const { showError } = useAlert();
  const { loader, showLoader, hideLoader } = useLoader();
  const { signIn: signinReq, getPodUserData, getLiteUserData } = useAuthService();

  const signinForm = ref();
  const accountType = ref("btlite");
  const visible = ref(false);

  const assetId = route.query?.asset_id;
  const memberId = route.query?.member_id;

  const signinData = ref({
    email: null,
    password: null,
    domain: null,
    service_id: constants.BYOTUBE_SERVICE_ID,
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
        [`${signinData.value.domain ? "username" : "email"}`]: email,
        password,
        service_id,
      });

      if (data && status == 200) {
        localStorage.setItem("token", data?.auth_token);
        localStorage.setItem("domain", signinData.value.domain);
        localStorage.setItem("member_id", data.member_id);
        localStorage.setItem("id_type", data.id_type);
        setAuth.value(true);
        setAuthAccountType();
        await requiredApis()
        if (assetId && memberId) {
          router.push({
            name: "Watch",
            query: { asset_id: assetId, member_id: memberId },
          });
        } else {
          router.push({ name: "Home" });
        }
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

  const requiredApis = async () => {
    try {
      if (!signinData.value.domain) {
        const { data: userData } = await getLiteUserData();
        localStorage.setItem('user', JSON.stringify(userData))
        if (userData?.show_external_assets) {
          coreStore.filter = { "name": "BYODA Hosted", "value": "published" }
        }
      } else {
        const { data: userData } = await getPodUserData(signinData.value.domain);
        localStorage.setItem('user', JSON.stringify(userData?.edges[0].node))
        if (userData?.edges[0].node?.show_external_assets) {
          coreStore.filter = { "name": "BYODA Hosted", "value": "published" }
          console.log("sdfsdfds", coreStore.filter);
        }
      }
      await nextTick();
      attestUserBurstPoints();
    } catch (error) {
      console.error("Error", error)
    }
  }

  const setAuthAccountType = () => {
    if (!signinData.value.domain) {
      localStorage.setItem("account", "btlite");
      setAccountType.value("btlite");
    } else {
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
