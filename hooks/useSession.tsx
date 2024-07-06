import HTTPClient from "@/lib/api";

const client = HTTPClient.getInstance();

const useLogin = () => {
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
        throw new Error(errors);
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
        throw new Error(errors);
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

  return { createSession, createUser };
};

export default useLogin;
