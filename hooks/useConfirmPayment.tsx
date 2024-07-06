import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useConfirmPayment = () => {
  const confirmPayment = async (token: string) => {
    try {
      const payment: any = await client.getPaymentByToken(String(token));

      const response: any = await client.confirmNewPayment(payment.id);

      switch (response.status) {
        case 1:
          return true;
        case 7:
          return false;
        default:
          console.log(
            "default confirmPayment response.status",
            response.status
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
