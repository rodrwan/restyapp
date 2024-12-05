import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useCreateOrder = () => {
  const create = async (cartList: any[]) => {
    const items: any = cartList
      ?.map((item: any) => {
        const elements = [];
        for (let idx = 0; idx < item.quantity; idx++) {
          elements.push({
            event_id: item.event_id,
            item_id: item.id,
            quantity: 1,
          });
        }

        return elements;
      })
      .flat();
    const body = {
      items: items,
    };

    try {
      const response: any = await client.createOrder(body);

      return response;
    } catch (err: any) {
      console.log(">>> err", err);
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        console.log("createOrder", err);
        throw new Error(err);
      }
    }
  };

  return { create };
};

export default useCreateOrder;
