import React, { useEffect } from "react";

import { router, useSegments } from "expo-router";
import useAuthStore from "@/stores/useAuth";

const CheckAuth = ({ redirectTo, children }: any) => {
  const { auth } = useAuthStore();
  const segment = useSegments();

  useEffect(() => {
    console.log("segment", segment);
    if (!auth.isLogged) {
      return router.replace(`/(auth)/sign-in?redirectTo=${redirectTo}`);
    }
  }, [auth, segment]);

  return <>{children}</>;
};

export default CheckAuth;
