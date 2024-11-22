import { Event } from "./types";

export function formatEventDate(startAt: string): string {
  return new Date(startAt).toLocaleString("es-CL", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function parseEventDateTime(event: Event): string {
  const splittedStartAt = event.start_at.split(" ");
  const startHour = event.start_hour.split("T")[1];
  return `${splittedStartAt[0]} ${startHour.replace("Z", "")}`;
}

export function sortByStartAt(a: Event, b: Event): number {
  const aDateTime = parseEventDateTime(a);
  const bDateTime = parseEventDateTime(b);
  return new Date(bDateTime).getTime() - new Date(aDateTime).getTime();
}
