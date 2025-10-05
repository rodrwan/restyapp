import { useState, useEffect } from "react";
import HTTPClient from "@/lib/api";
import useUserStore from "@/stores/useUser";

const client = HTTPClient.getInstance();

const useGetUserTickets = (eventId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTickets, user } = useUserStore();

  const getUserTickets = async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await client.getTicketsByUserAndEventID(eventId);

      if (response.data?.getTickets?.data) {
        const tickets = response.data.getTickets.data.map((item: any) => ({
          id: item.ticket.id,
          base64: item.ticket.base64,
          is_validated: item.ticket.is_validated,
          event: item.event,
          name: item.event_item.name,
          cover: item.ticket.cover,
        }));

        setTickets(tickets);
        return tickets;
      }

      return [];
    } catch (err: any) {
      const errorMessage =
        err?.response?.errors?.[0]?.message || "Error al cargar tickets";
      setError(errorMessage);
      console.error("Error loading user tickets:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTickets();
  }, [eventId]);

  return {
    loading,
    error,
    tickets: user?.tickets || [],
    refetch: getUserTickets,
  };
};

export default useGetUserTickets;
