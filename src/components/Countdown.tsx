"use client";
import { useEffect, useState } from "react";

// Soorasamharam evening, ~5:00 PM IST on 15 Nov 2026
const TARGET = new Date("2026-11-15T17:00:00+05:30").getTime();

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <div className="h-20" />;
  const diff = Math.max(0, TARGET - now);
  if (diff === 0)
    return <p className="font-tamil text-2xl font-bold">🔱 சூரசம்ஹாரம் நிறைவுற்றது — அரோகரா!</p>;
  const parts = [
    { v: Math.floor(diff / 86400000), l: "நாள்" },
    { v: Math.floor((diff / 3600000) % 24), l: "மணி" },
    { v: Math.floor((diff / 60000) % 60), l: "நிமிடம்" },
    { v: Math.floor((diff / 1000) % 60), l: "விநாடி" },
  ];
  return (
    <div className="flex gap-2 md:gap-3">
      {parts.map((p) => (
        <div key={p.l} className="rounded-2xl bg-white/20 backdrop-blur px-3 py-2 md:px-4 md:py-3 text-center min-w-16">
          <div className="text-2xl md:text-4xl font-bold tabular-nums">{String(p.v).padStart(2, "0")}</div>
          <div className="text-[11px] md:text-xs font-tamil">{p.l}</div>
        </div>
      ))}
    </div>
  );
}
