import { useBurstPoints, useLoader, useHelper } from "@/composables";
import { usePaymentService } from "@/services";
import { useAuthStore } from "@/store";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

export const useTransactions = () => {

  const { isAuthenticated, isBtLiteAccount } = storeToRefs(useAuthStore())

  const { getTransactions } = usePaymentService();
  const { checkUserBurstPoints} = useBurstPoints()

  const { loader, showLoader, hideLoader } = useLoader()
  const { loader: tableLoader, showLoader: showTableLoader, hideLoader: hideTableLoader } = useLoader()
  const { toQueryString } = useHelper()


  const transactions = ref([]);
  const balance = ref('')

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
      width: "120",
    },
    {
      title: "Description",
      key: "description",
      align: "start",
      sortable: false,
      width: "120",
    },
  ];

  const sources = {
    "f7d6d367-3d1a-4424-8ba5-139e8f3a51c3": "BYO.Pay",
    "928ef3d7-f4fd-4b41-b6c8-2bc4a201b2e8": "BYO-Stream",
  };

  const transactionTypes = {
    purchase: "Purchase",
    streaming: "Streaming",
    "pay-out": "Pay-Out",
    receive: "Receive",
  };

  const isRegisterVisible = computed(()=>{
    return isAuthenticated.value && !isBtLiteAccount.value && +balance.value > 10000
  })

  const isPayoutvisible = computed(()=>{
    return isAuthenticated.value && !isBtLiteAccount.value && +balance.value > 10000
  })

  const getAllTransactions = async () => {
    try {
      showTableLoader()
      const { data } = await getTransactions();
      transactions.value = data?.edges?.map((edge) => edge?.node);
    } catch (error) {
      console.error("Error", error)
    } finally {
      hideTableLoader()
    }
  };

  const getBalance = async () => {
    try {
      showLoader()
      balance.value = await checkUserBurstPoints()
    } catch (error) {
      console.error("Error", error)
    } finally {
      hideLoader()
    }
  }



  return {
    isRegisterVisible,
    balance,
    sources,
    loader, 
    tableLoader,
    transactionTypes,
    headers,
    transactions,
    getAllTransactions,
    getBalance,
  };
};
