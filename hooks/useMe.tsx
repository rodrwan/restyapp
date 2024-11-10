import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";
import React from "react";

const client = HTTPClient.getInstance();

const useMe = () => {
  const [loadingUserData, setLoadingUserData] = React.useState(false);
  const { setUser } = useUserStore();

  const me = async () => {
    setLoadingUserData(true);
    try {
      const [response, errors] = await client.me();
      if (errors?.length > 0) {
        throw errors;
      }

      setUser(response?.user);
      setLoadingUserData(false);
      return response;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        return null;
      }
    }
  };

  return { loadingUserData, me };
};

export default useMe;
