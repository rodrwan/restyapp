import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useDeleteInscription = (eventId: string) => {
  const deleteInscription = async () => {
    try {
      const response: any = await client.deleteInscription(eventId);
      const data = response.data?.deleteInscription;
      return data;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        throw new Error(err);
      }
    }
  };

  return { deleteInscription };
};

export default useDeleteInscription;
