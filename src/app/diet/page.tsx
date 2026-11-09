import PageHero from "@/components/PageHero";
import { DIET_LEVELS, FOODS } from "@/data/sashti";

export const metadata = { title: "உணவு முறை · கந்த சஷ்டி 2026" };

export default function DietPage() {
  return (
    <>
      <PageHero
        kicker="Sattvic diet for the viratham"
        title="விரத உணவு முறை"
        subtitle="உங்கள் உடல்நிலைக்கு ஏற்ற நிலையைத் தேர்ந்தெடுங்கள். பட்டினி அல்ல — பக்தியே விரதத்தின் உயிர்."
      />

      <section className="mt-10">
        <h2 className="font-tamil text-2xl font-extrabold mb-4">விரத நிலைகள்</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIET_LEVELS.map((l, i) => (
            <div key={l.name} className="card overflow-hidden flex flex-col">
              <div className={`bg-gradient-to-br ${l.color} text-white p-4`}>
                <p className="text-xs opacity-90">நிலை {4 - i}</p>
                <h3 className="font-tamil font-extrabold text-lg">{l.name}</h3>
                <p className="text-xs opacity-90">{l.en}</p>
              </div>
              <div className="p-4 text-sm space-y-2">
                <p><b>யாருக்கு:</b> {l.who}</p>
                <p><b>என்ன:</b> {l.what}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="card p-6">
          <h2 className="font-tamil text-xl font-extrabold mb-4 text-emerald-600">✔ உண்ணலாம்</h2>
          <div className="space-y-4">
            {FOODS.eat.map((g) => (
              <div key={g.cat}>
                <p className="font-semibold text-sm mb-2">{g.cat}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span key={it} className="rounded-full px-3 py-1 text-sm bg-emerald-500/10 border border-emerald-500/30">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-tamil text-xl font-extrabold mb-4 text-rose-600">✘ தவிர்க்கவும்</h2>
          <ul className="space-y-2">
            {FOODS.avoid.map((a) => (
              <li key={a} className="flex gap-2 text-[15px]"><span>🚫</span>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 card p-6">
        <h2 className="font-tamil text-xl font-extrabold mb-1">🍽️ மாதிரி ஒரு நாள் (ஒருவேளை உணவு நிலை)</h2>
        <p className="text-sm muted mb-4">Sample day — one-meal level</p>
        <ol className="relative border-l-2 border-saffron/50 ml-2 space-y-4">
          {FOODS.sampleDay.map((s) => (
            <li key={s.time} className="pl-5 relative">
              <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-saffron to-vermilion" />
              <p className="text-xs font-bold text-saffron">{s.time}</p>
              <p className="text-[15px]">{s.meal}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 card p-6 border-2 border-amber-400/60 bg-amber-400/10">
        <h2 className="font-tamil text-xl font-extrabold mb-3">⚕️ உடல்நல எச்சரிக்கை</h2>
        <ul className="space-y-2 text-[15px] list-disc pl-5">
          {FOODS.health.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
