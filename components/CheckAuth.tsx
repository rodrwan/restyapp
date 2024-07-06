import React, { useEffect } from "react";

import { router } from "expo-router";
import useAuthStore from "@/stores/useAuth";

const CheckAuth = ({ redirectTo, children }: any) => {
  const { auth } = useAuthStore();

  useEffect(() => {
    if (!auth.isLogged) {
      return router.push(`/(auth)/sign-in?redirectTo=${redirectTo}`);
    }
  }, [auth]);

  return <>{children}</>;
};

export default CheckAuth;
