import React, { useCallback, useMemo } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import useUserStore from "@/stores/useUser";
import useGetEventsFromUser from "@/hooks/useGetEventsFromUser";
import useGetUserFirstUpcomingEvent from "@/hooks/useGetUserFirstUpcomingEvent";
import { useSession } from "@/context/AuthProvider";

// Import components from local components folder
import {
  LoadingScreen,
  ProfileBanner,
  UserProfileCard,
  NextEventsSection,
  UpcomingEvent,
  EmptyEventsState,
  isProfileIncomplete,
  isEventPast,
} from "@/components/dashboard";

interface HomePageProps {}

// Main Component
const HomePage: React.FC<HomePageProps> = () => {
  const { session } = useSession();
  const { loadingUpcomingEvent, getUserFirstUpcomingEvent } =
    useGetUserFirstUpcomingEvent();
  const { user, upcomingEvent } = useUserStore();
  const { loadingGetEvents, getEvents } = useGetEventsFromUser();

  // Effects - Removed problematic dependencies to prevent infinite loop
  React.useEffect(() => {
    getEvents();
    getUserFirstUpcomingEvent();
  }, []); // Empty dependency array to run only once on mount

  // Callbacks
  const handleRefresh = useCallback(() => {
    getUserFirstUpcomingEvent();
  }, [getUserFirstUpcomingEvent]);

  const handleCompleteProfile = useCallback(() => {
    router.push("/(modal)/complete-profile");
  }, []);

  // Memoized values
  const isLoading = loadingGetEvents && loadingUpcomingEvent;
  const profileIncomplete = useMemo(() => isProfileIncomplete(user), [user]);
  const hasUpcomingEvent = useMemo(
    () => !!upcomingEvent?.event,
    [upcomingEvent?.event]
  );

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
          refreshing={loadingUpcomingEvent}
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

        {profileIncomplete && <ProfileBanner onPress={handleCompleteProfile} />}
      </LinearGradient>
    </ScrollView>
  );
};

export default HomePage;
