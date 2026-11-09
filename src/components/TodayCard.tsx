"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { status, prettyDate } from "@/lib/dates";

export default function TodayCard() {
  const [s, setS] = useState<ReturnType<typeof status> | null>(null);
  useEffect(() => {
    setS(status());
  }, []);
  if (!s) return <div className="card h-48 animate-pulse" />;
  const d = s.day;
  const label =
    s.phase === "before" ? "நாளை தொடக்கம் · Begins soon" : s.phase === "during" ? `இன்று · நாள் ${d.n}` : "விரதம் நிறைவு";
  return (
    <div className="card overflow-hidden">
      <div className={`bg-gradient-to-r ${d.color} text-white p-5`}>
        <p className="text-xs uppercase tracking-widest font-semibold opacity-90">{label}</p>
        <h3 className="font-tamil text-2xl font-extrabold mt-1">
          நாள் {d.n} — {d.titleTa}
        </h3>
        <p className="text-sm opacity-90">
          {prettyDate(d.date)} · {d.weekdayTa} · {d.tithi} · 🛕 {d.padaiVeedu}
        </p>
      </div>
      <div className="p-5 grid sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="font-semibold text-vermilion">🎯 இன்றைய நோக்கம்</p>
          <p className="mt-1 leading-relaxed">{d.focus}</p>
        </div>
        <div>
          <p className="font-semibold text-peacock">📜 வாசிப்பு</p>
          <p className="mt-1">{d.kandaPuranam}</p>
          <p className="mt-1 muted">அனுபூதி: {d.anubhuti}</p>
        </div>
        <div>
          <p className="font-semibold text-saffron">🍃 உணவு</p>
          <p className="mt-1">{d.diet}</p>
          <Link href={`/calendar#day-${d.n}`} className="inline-block mt-3 font-semibold text-vermilion hover:underline">
            முழு நாள் திட்டம் →
          </Link>
        </div>
      </div>
    </div>
  );
}
