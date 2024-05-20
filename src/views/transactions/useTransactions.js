import { usePaymentService } from "@/services";
import { ref } from "vue";

export const useTransactions = () => {
  const { getTransactions } = usePaymentService();

  const transactions = ref([]);

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
    // {
    //   title: "Link",
    //   key: "transaction_id",
    //   align: "start",
    //   sortable: false,
    //   width: "120",
    // },
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

  const getAllTransactions = async () => {
    try {
      const { data } = await getTransactions();
      transactions.value = data?.edges?.map((edge) => edge?.node);
    } catch (error) {}
  };

  return {
    sources,
    transactionTypes,
    headers,
    transactions,
    getAllTransactions,
  };
};
