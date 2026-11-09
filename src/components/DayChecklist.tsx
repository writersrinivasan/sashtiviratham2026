"use client";
import { useEffect, useState } from "react";

const ITEMS = [
  "அதிகாலை நீராடல் & விளக்கு",
  "கந்த சஷ்டி கவசம் — காலை",
  "ஓம் சரவணபவ ஜபம்",
  "கோவில் தரிசனம்",
  "கந்த புராணம் / அனுபூதி வாசிப்பு",
  "திருப்புகழ் / பாடல்கள்",
  "கந்த சஷ்டி கவசம் — மாலை",
  "உணவு நியமம் கடைப்பிடித்தேன்",
  "ஒரு தானம் / நற்செயல்",
];

function load(key: string): boolean[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    if (Array.isArray(v)) return ITEMS.map((_, i) => !!v[i]);
  } catch {}
  return ITEMS.map(() => false);
}

export default function DayChecklist({ day }: { day: number }) {
  const key = `sashti2026-day-${day}`;
  const [done, setDone] = useState<boolean[]>(() => ITEMS.map(() => false));
  useEffect(() => {
    setDone(load(key));
  }, [key]);

  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v));
    setDone(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };
  const pct = Math.round((done.filter(Boolean).length / ITEMS.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm">✅ இன்றைய சாதனா</p>
        <p className="text-xs font-bold text-peacock">{pct}%</p>
      </div>
      <div className="h-2 rounded-full bg-black/10 overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-peacock via-gold to-saffron transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="grid sm:grid-cols-2 gap-1.5">
        {ITEMS.map((it, i) => (
          <li key={it}>
            <label className="flex items-start gap-2 text-sm cursor-pointer rounded-lg px-2 py-1 hover:bg-orange-500/10">
              <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} className="mt-1 accent-[#e2231a]" />
              <span className={done[i] ? "line-through opacity-60" : ""}>{it}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
