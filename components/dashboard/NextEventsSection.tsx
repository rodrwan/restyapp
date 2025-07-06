import React, { useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import EmptyState from "@/components/EmptyState";
import { Event } from "./types";
import EventCard from "./EventCard";

interface NextEventsSectionProps {
  events: Event[];
}

const NextEventsSection: React.FC<NextEventsSectionProps> = React.memo(
  ({ events }) => {
    const renderEventCard = useCallback(
      ({ item, index }: { item: Event; index: number }) => (
        <EventCard event={item} index={index} />
      ),
      []
    );

    const keyExtractor = useCallback((item: Event) => item.id, []);

    if (!events || events.length === 0) {
      return null;
    }

    return (
      <View className="flex mx-2">
        <View className="mb-4">
          <Text className="text-white font-bold text-xl mx-2">
            Próximamente
          </Text>
        </View>
        <View className="bg-white rounded-xl mx-2">
          <FlatList
            scrollEnabled={false}
            className="p-2"
            data={events}
            keyExtractor={keyExtractor}
            renderItem={renderEventCard}
            ListEmptyComponent={() => (
              <EmptyState
                title="El sistema aún no ha encontrado nuevos eventos"
                subtitle="Próximamente acá aparecerán los eventos que tienes a tu disposición"
              />
            )}
          />
        </View>
      </View>
    );
  }
);

export default NextEventsSection;
