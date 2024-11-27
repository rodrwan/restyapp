import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";

const client = HTTPClient.getInstance();

const useLogin = () => {
  const { setUser } = useUserStore();
  const createSession = async (
    username: string,
    password: string,
    source: string
  ) => {
    try {
      const [response, errors] = await client.signIn({
        username,
        password,
        source,
      });
      if (errors?.length > 0) {
        throw errors;
      }

      return response;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        return null;
      }
    }
  };

  const me = async () => {
    try {
      const [response, errors] = await client.me();
      if (errors?.length > 0) {
        throw errors;
      }

      setUser(response?.user);
      return response;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        return null;
      }
    }
  };

  const createUser = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    picture: string,
    source: string
  ) => {
    try {
      const [response, errors] = await client.signUp({
        firstname,
        lastname,
        email,
        password,
        picture,
        source,
        reference_id: password,
      });
      if (errors?.length > 0) {
        throw errors;
      }

      return response;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      } else {
        return null;
      }
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await client.requestPasswordReset(email);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (code: string, newPassword: string) => {
    try {
      const response = await client.resetPassword(code, newPassword);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { createSession, createUser, me, resetPassword, requestPasswordReset };
};

export default useLogin;
