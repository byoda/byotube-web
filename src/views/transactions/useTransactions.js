import { useBurstPoints, useLoader } from "@/composables";
import { usePaymentService } from "@/services";
import { useAuthStore, useCoreStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

export const useTransactions = () => {
  const { isByotubeAccount } = storeToRefs(useAuthStore());

  const { getTransactions, getAccount, getPayoutDetails, getPurchaseDetails } =
    usePaymentService();
  const { checkUserBurstPoints } = useBurstPoints();

  const { loader, showLoader, hideLoader } = useLoader();
  const {
    loader: tableLoader,
    showLoader: showTableLoader,
    hideLoader: hideTableLoader,
  } = useLoader();

  const { OpenDialog } = useCoreStore();

  const account = ref(null);

  const transactions = ref([]);
  const balance = ref("");
  const payoutInfo = ref(null);
  const paymentInfo = ref(null);

  const headers = [
    {
      title: "Date",
      key: "timestamp",
      align: "center",
      sortable: false,
      width: "120",
    },
    {
      title: "Change",
      align: "start",
      sortable: false,
      key: "delta",
      width: "80px",
    },
    {
      title: "From",
      align: "start",
      sortable: false,
      key: "source_id",
      width: "80px",
    },
    {
      title: "To",
      align: "start",
      sortable: false,
      key: "destination_id",
      width: "80px",
    },
    {
      title: "Type",
      key: "transaction_type",
      align: "start",
      sortable: false,
      width: "80",
    },
    {
      title: "Description",
      key: "description",
      align: "start",
      sortable: false,
      width: "140",
    },
  ];

  const sources = {
    "f7d6d367-3d1a-4424-8ba5-139e8f3a51c3": "BYO.Pay",
    "928ef3d7-f4fd-4b41-b6c8-2bc4a201b2e8": "BYO-Stream",
  };

  const transactionTypes = {
    purchase: "Purchase",
    streaming: "Streaming",
    stream: "Stream",
    refund: "Refund",
    donate: "Donate",
    payout: "Pay-Out",
    receive: "Receive",
  };

  const isRegisterVisible = ref(false);

  const isPayoutvisible = computed(() => {
    return !(
      account.value?.payout_provider_id == null ||
      account.value?.payout_provider_id?.startsWith('"(') ||
      account.value?.payout_provider_status == null ||
      account.value?.payout_provider_status?.startsWith('"(')
    );
  });

  const getAllTransactions = async () => {
    try {
      showTableLoader();
      const { data } = await getTransactions();
      transactions.value = data?.edges?.map((edge) => edge?.node);
    } catch (error) {
      console.error("Error", error);
    } finally {
      hideTableLoader();
    }
  };

  const getBalance = async () => {
    try {
      showLoader();
      balance.value = await checkUserBurstPoints();
    } catch (error) {
      console.error("Error", error);
    } finally {
      hideLoader();
    }
  };

  const getAccountInfo = async () => {
    try {
      const { data } = await getAccount();
      account.value = data;
    } catch (error) {
      console.error("Error", error);
      if (error?.response?.status === 404) {
        isRegisterVisible.value = true;
      }
    }
  };

  const getPayoutInfo = async (payoutId) => {
    try {
      payoutInfo.value = null;
      const { data } = await getPayoutDetails(payoutId);
      payoutInfo.value = data;
    } catch (error) {
      console.error("Error", error);
      if (error.status === 404) {
        isRegisterVisible.value = true;
      }
    } finally{
      OpenDialog("payout-info-dialog");
    }
  };

  const getPurchaseInfo = async (purchaseId) => {
    try {
      paymentInfo.value = null;
      const { data } = await getPurchaseDetails(purchaseId);
      paymentInfo.value = data;
      OpenDialog("payment-info-dialog");
    } catch (error) {
      console.error("Error", error);
      if (error.status === 404) {
        isRegisterVisible.value = true;
      }
    } finally {
      OpenDialog("payment-info-dialog");
    }
  };

  return {
    payoutInfo,
    paymentInfo,
    account,
    isRegisterVisible,
    balance,
    sources,
    loader,
    tableLoader,
    transactionTypes,
    headers,
    transactions,
    isPayoutvisible,
    getAllTransactions,
    getBalance,
    getAccountInfo,
    getPayoutInfo,
    getPurchaseInfo,
  };
};
