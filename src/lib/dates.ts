import { DAYS, FESTIVAL } from "@/data/sashti";

/** Today's date (YYYY-MM-DD) in India Standard Time. */
export function todayIST(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

/** Returns the viratham day for a given ISO date, or null outside the festival. */
export function dayFor(iso: string) {
  return DAYS.find((d) => d.date === iso) ?? null;
}

export function status(iso = todayIST()) {
  const d = dayFor(iso);
  if (d) return { phase: "during" as const, day: d };
  if (iso < FESTIVAL.vratamStart) return { phase: "before" as const, day: DAYS[0] };
  return { phase: "after" as const, day: DAYS[DAYS.length - 1] };
}

export function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("ta-IN", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}
