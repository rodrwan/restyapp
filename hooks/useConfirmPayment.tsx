import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useConfirmPayment = () => {
  const confirmPayment = async (token: string) => {
    try {
      const payment: any = await client.getPaymentByToken(String(token));
      const data = payment.data?.getPaymentByToken;
      const response: any = await client.confirmNewPayment(data.id);

      switch (response.data?.confirmPayment.status) {
        case 1:
          return true;
        case 7:
          return false;
        default:
          console.log(
            "default confirmPayment response.status",
            response.data?.confirmPayment.status
          );
          return false;
      }
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        throw new Error(err);
      }
    }
  };

  return { confirmPayment };
};

export default useConfirmPayment;
