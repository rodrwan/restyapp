import { Event, User } from "./types";

export const formatEventDate = (dateString: string): string => {
  if (!dateString) return "";
  const splittedStartAt = dateString.split(" ");
  const joinedStartAt = splittedStartAt[0] + " " + splittedStartAt[1];
  const formatted = new Date(joinedStartAt).toLocaleString("es-CL", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
  return formatted
    ? formatted.charAt(0).toUpperCase() + formatted.slice(1)
    : "";
};

export const formatEventTime = (dateString: string): string => {
  if (!dateString) return "";
  const splittedStartAt = dateString.split(" ");
  const joinedStartAt = splittedStartAt[0] + " " + splittedStartAt[1];
  const formatted = new Date(joinedStartAt).toLocaleString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatted || "";
};

export const isEventPast = (event: Event): boolean => {
  if (!event?.start_at) return false;
  const splittedStartAt = event.start_at.split(" ");
  const joinedStartAt = splittedStartAt[0] + " " + splittedStartAt[1];
  return new Date(joinedStartAt).getTime() < new Date().getTime();
};

export const isProfileIncomplete = (user: User | null): boolean => {
  return !user || user.gender === "" || !user?.birth_date || user.dni === "";
};
