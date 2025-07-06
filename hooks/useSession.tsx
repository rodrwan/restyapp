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
      const response = await client.signIn({
        username,
        password,
        source,
      });

      return response.data?.login;
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
      const response = await client.me();
      setUser(response.data?.me?.user);
      return response.data?.me?.user;
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
      const response = await client.signUp({
        firstname,
        lastname,
        email,
        password,
        picture,
        source,
        reference_id: password,
      });

      return response.data?.register;
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
      return response.data?.requestPasswordReset;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (code: string, newPassword: string) => {
    try {
      const response = await client.resetPassword(code, newPassword);
      return response.data?.resetPassword;
    } catch (error) {
      throw error;
    }
  };

  const deleteMe = async () => {
    try {
      const response = await client.deleteMe();
      return response.data?.deleteMe;
    } catch (err: any) {
      if (err?.response?.errors[0]?.message === "session has expired") {
        throw new Error("expired session");
      }

      throw err;
    }
  };

  const updateUserExtra = async (user: any) => {
    try {
      const response = await client.updateUserExtra(user);
      return response.data?.updateUserExtra;
    } catch (error) {
      throw error;
    }
  };

  return {
    createSession,
    createUser,
    me,
    resetPassword,
    requestPasswordReset,
    deleteMe,
    updateUserExtra,
  };
};

export default useLogin;
