import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useConfirmInscription = () => {
  const confirmInscription = async (token: string) => {
    try {
      const response: any = await client.confirmInscription(token);

      if (response.card_number) {
        return response;
      }
      return null;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        throw new Error(err);
      }
    }
  };

  return { confirmInscription };
};

export default useConfirmInscription;
