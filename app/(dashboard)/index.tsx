import React, { useCallback, useMemo } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import useUserStore from "@/stores/useUser";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import useGetUserUpcomingEvents from "@/hooks/useGetUserUpcomingEvents";

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
  const { loadingUpcomingEvent, getUserUpcomingEvents } =
    useGetUserUpcomingEvents();
  const { user, upcomingEvents } = useUserStore();
  const { loadingGetEvents, getEvents } = useGetEventsFromUser();
  const { isLoadingGetCourtesies, getCourtesies } = useGetCourtesies(
    upcomingEvents?.[0]?.id || ""
  );

  // Track if courtesies have been loaded
  const hasLoadedCourtesiesRef = React.useRef(false);

  // Effects - Load data on mount
  React.useEffect(() => {
    getEvents();
    getUserUpcomingEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load courtesies only once when upcomingEvents is available
  const eventId = upcomingEvents?.[0]?.id;
  React.useEffect(() => {
    if (eventId && eventId.trim() !== "" && !hasLoadedCourtesiesRef.current) {
      hasLoadedCourtesiesRef.current = true;
      getCourtesies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // Callbacks
  const handleRefresh = useCallback(() => {
    hasLoadedCourtesiesRef.current = false;
    getUserUpcomingEvents();
  }, [getUserUpcomingEvents]);

  // Memoized values
  const hasValidEventId =
    upcomingEvents?.[0]?.id && upcomingEvents[0]?.id.trim() !== "";
  const isLoading =
    loadingGetEvents ||
    loadingUpcomingEvent ||
    (hasValidEventId && isLoadingGetCourtesies);
  const hasUpcomingEvent = useMemo(() => {
    // Verificar que el evento existe Y tiene datos válidos (no vacíos)
    const hasEvent = !!upcomingEvents?.[0];
    const hasValidId =
      upcomingEvents?.[0]?.id && upcomingEvents[0]?.id.trim() !== "";
    const hasValidName =
      upcomingEvents?.[0]?.name && upcomingEvents[0]?.name.trim() !== "";

    const result = hasEvent && hasValidId && hasValidName;

    return result;
  }, [upcomingEvents]);

  const nextEvents = useMemo(() => {
    if (!user?.events || !upcomingEvents?.[0]?.id) return [];

    return user.events
      .filter((event) => event.id !== upcomingEvents[0]?.id)
      .filter(isEventPast);
  }, [user?.events, upcomingEvents]);

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
          <UpcomingEvent upcomingEvent={upcomingEvents[0]} user={user!} />
        )}

        <NextEventsSection events={nextEvents} />
      </LinearGradient>
    </ScrollView>
  );
};

export default HomePage;
