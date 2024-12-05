import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useCreatePayment = () => {
  const createPayment = async (orderId: string, nominees: any[]) => {
    const body: any = {
      order_id: orderId,
      terms_and_conditions_signed: true,
      alcohol_signed: true,
      nominated_items: nominees?.map((nominated: any) => {
        return {
          order_id: nominated.orderId,
          order_item_id: nominated.id,
          email: nominated.email,
          dni: nominated.dni,
        };
      }),
    };

    try {
      const response: any = await client.createPayment(body);

      return response;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        throw new Error(err);
      }
    }
  };

  return { createPayment };
};

export default useCreatePayment;
