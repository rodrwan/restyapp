import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useCreateInscription = () => {
  const createInscription = async () => {
    try {
      const response: any = await client.createInscription();

      return response;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        throw new Error(err);
      }
    }
  };

  return { createInscription };
};

export default useCreateInscription;
