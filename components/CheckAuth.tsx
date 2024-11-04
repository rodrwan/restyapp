import React, { useEffect } from "react";

import { router, useSegments } from "expo-router";
import useAuthStore from "@/stores/useAuth";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";

const CheckAuth = ({ redirectTo, children }: any) => {
  // const { getEvents }: any = useGetEventsFromUser();
  const { auth } = useAuthStore();
  const segment = useSegments();

  useEffect(() => {
    // getEvents()
    //   .then(() => {
    console.log("segment", segment);
    console.log("auth.isLogged", auth.isLogged);
    if (!auth.isLogged) {
      return router.replace(`/(auth)/sign-in?redirectTo=${redirectTo}`);
    }
    // })
    // .catch((err: any) => {
    //   console.log("CheckAuth error", err);
    // });
  }, [auth, segment]);

  return <>{children}</>;
};

export default CheckAuth;
