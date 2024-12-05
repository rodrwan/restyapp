export function formatEventDates(event: any) {
  const splittedStartAt = event?.start_at.split(" ");
  const hour = event?.start_hour.split("T")?.[1] || "";
  const joinedStartAt = splittedStartAt?.[0] + " " + hour?.replace("Z", "");

  const startAt = new Date(joinedStartAt).toLocaleString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startHour = new Date(joinedStartAt).toLocaleString("es-CL", {
    minute: "2-digit",
    hour: "2-digit",
  });

  const splittedEndAt = event?.end_at?.split(" ");
  const endHour = event?.end_hour?.split("T")?.[1] || "";
  const joinedEndAt = splittedEndAt?.[0] + " " + endHour?.replace("Z", "");
  const endAt = new Date(joinedEndAt)?.toLocaleString("us-US", {
    minute: "2-digit",
    hour: "2-digit",
  });

  return { startAt, startHour, endAt };
}
