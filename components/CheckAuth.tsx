import React, { useEffect } from "react";

import { router, useSegments } from "expo-router";
import useAuthStore from "@/stores/useAuth";

const CheckAuth = ({ redirectTo, children }: any) => {
  const { auth } = useAuthStore();
  const segment = useSegments();

  useEffect(() => {
    if (segment.length === 0) {
      return router.replace("/");
    }

    if (!auth.isLogged) {
      return router.replace(`/(auth)/sign-in?redirectTo=${redirectTo}`);
    }
  }, [auth]);

  return <>{children}</>;
};

export default CheckAuth;
