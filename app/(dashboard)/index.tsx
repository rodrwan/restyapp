import React, { useCallback, useMemo } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import useUserStore from "@/stores/useUser";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import useGetUserFirstUpcomingEvent from "@/hooks/useGetUserFirstUpcomingEvent";

// Import components from local components folder
import {
  LoadingScreen,
  UserProfileCard,
  NextEventsSection,
  UpcomingEvent,
  EmptyEventsState,
  isEventPast,
} from "@/components/dashboard";
import useGetCourtesies from "@/hooks/useGetCourtesies";

interface HomePageProps {}

// Main Component
const HomePage: React.FC<HomePageProps> = () => {
  const { loadingUpcomingEvent, getUserFirstUpcomingEvent } =
    useGetUserFirstUpcomingEvent();
  const { user, upcomingEvent } = useUserStore();
  const { loadingGetEvents, getEvents } = useGetEventsFromUser();
  // Solo inicializar useGetCourtesies si tenemos un eventId válido
  const { isLoadingGetCourtesies, getCourtesies } = useGetCourtesies(
    upcomingEvent?.event?.id || ""
  );

  // Effects - Run only once on mount to prevent infinite loop
  React.useEffect(() => {
    getEvents();
    getUserFirstUpcomingEvent();
  }, [getEvents, getUserFirstUpcomingEvent]);

  // Separate effect for courtesies - only run when we have a valid eventId
  React.useEffect(() => {
    if (upcomingEvent?.event?.id && upcomingEvent.event.id.trim() !== "") {
      getCourtesies();
    }
  }, [upcomingEvent?.event?.id, getCourtesies]);

  // Callbacks
  const handleRefresh = useCallback(() => {
    getUserFirstUpcomingEvent();
  }, [getUserFirstUpcomingEvent]);

  // Memoized values
  const hasValidEventId =
    upcomingEvent?.event?.id && upcomingEvent.event.id.trim() !== "";
  const isLoading =
    loadingGetEvents ||
    loadingUpcomingEvent ||
    (hasValidEventId && isLoadingGetCourtesies);

  const hasUpcomingEvent = useMemo(() => {
    // Verificar que el evento existe Y tiene datos válidos (no vacíos)
    const hasEvent = !!upcomingEvent?.event;
    const hasValidId =
      upcomingEvent?.event?.id && upcomingEvent.event.id.trim() !== "";
    const hasValidName =
      upcomingEvent?.event?.name && upcomingEvent.event.name.trim() !== "";

    const result = hasEvent && hasValidId && hasValidName;

    return result;
  }, [upcomingEvent?.event]);

  const nextEvents = useMemo(() => {
    if (!user?.events || !upcomingEvent?.event?.id) return [];

    return user.events
      .filter((event) => event.id !== upcomingEvent.event.id)
      .filter(isEventPast);
  }, [user?.events, upcomingEvent?.event?.id]);

  // Loading state - only show full loading screen if both are loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      className="flex h-auto bg-[#04121A]"
      refreshControl={
        <RefreshControl
          refreshing={loadingUpcomingEvent || isLoadingGetCourtesies}
          onRefresh={handleRefresh}
        />
      }
    >
      <LinearGradient
        colors={["#04121A", "#041e2b"]}
        className="flex h-full pb-16"
      >
        <UserProfileCard user={user!} />

        {!hasUpcomingEvent ? (
          <EmptyEventsState />
        ) : (
          <UpcomingEvent upcomingEvent={upcomingEvent} user={user!} />
        )}

        <NextEventsSection events={nextEvents} />
      </LinearGradient>
    </ScrollView>
  );
};

export default HomePage;
