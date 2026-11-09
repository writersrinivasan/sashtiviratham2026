import PageHero from "@/components/PageHero";
import DayChecklist from "@/components/DayChecklist";
import { DAYS, FESTIVAL } from "@/data/sashti";
import { prettyDate } from "@/lib/dates";

export const metadata = { title: "நாள்காட்டி · கந்த சஷ்டி 2026" };

export default function CalendarPage() {
  return (
    <>
      <PageHero
        kicker="Viratham Calendar · Nov 10 – 16, 2026"
        title="கந்த சஷ்டி விரத நாள்காட்டி"
        subtitle="ஆறு நாள் — ஆறு படைவீடு — ஆறு காண்டம். ஒவ்வொரு நாளுக்கும் நோக்கம், வாசிப்பு, ஜபம், சிறப்பு வழிபாடு, உணவு."
      >
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-white/20 px-3 py-1">🌑 தொடக்கம்: {prettyDate(FESTIVAL.vratamStart)} (பிரதமை)</span>
          <span className="rounded-full bg-white/20 px-3 py-1">🔱 சூரசம்ஹாரம்: {prettyDate(FESTIVAL.soorasamharam)}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">💐 திருக்கல்யாணம்: {prettyDate(FESTIVAL.thirukalyanam)}</span>
        </div>
      </PageHero>

      <p className="mt-4 text-xs muted">{FESTIVAL.note}</p>

      <div className="mt-8 relative">
        <div className="absolute left-5 md:left-7 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-saffron via-peacock to-fuchsia-500 opacity-40" />
        <ol className="space-y-8">
          {DAYS.map((d) => (
            <li key={d.n} id={`day-${d.n}`} className="relative pl-14 md:pl-20 scroll-mt-24">
              <span
                className={`absolute left-0 top-2 w-11 h-11 md:w-14 md:h-14 rounded-full grid place-items-center text-white text-xl md:text-2xl font-extrabold bg-gradient-to-br ${d.color} shadow-lg ring-4 ring-[color:var(--bg)]`}
              >
                {d.n}
              </span>
              <article className="card overflow-hidden">
                <header className={`bg-gradient-to-r ${d.color} text-white px-5 py-4`}>
                  <p className="text-xs font-semibold opacity-90">
                    {prettyDate(d.date)} · {d.weekdayTa} ({d.weekdayEn}) · திதி: {d.tithi}
                  </p>
                  <h2 className="font-tamil text-2xl font-extrabold">{d.titleTa}</h2>
                  <p className="text-sm opacity-90">{d.titleEn}</p>
                </header>
                <div className="p-5 grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4 text-[15px]">
                    <div className="rounded-xl bg-gradient-to-r from-peacock/10 to-transparent p-3">
                      <p className="font-tamil font-bold text-peacock">🛕 {d.padaiVeedu}</p>
                      <p className="text-sm muted">{d.padaiMeaning}</p>
                    </div>
                    <p className="leading-relaxed">{d.focus}</p>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                      <dt className="font-semibold text-vermilion">📜 கந்த புராணம்</dt>
                      <dd>{d.kandaPuranam}</dd>
                      <dt className="font-semibold text-vermilion">🌺 அனுபூதி</dt>
                      <dd>{d.anubhuti}</dd>
                      <dt className="font-semibold text-vermilion">🎶 திருப்புகழ்</dt>
                      <dd>{d.thiruppugazh}</dd>
                      <dt className="font-semibold text-vermilion">📿 ஜபம்</dt>
                      <dd>{d.japam}</dd>
                      <dt className="font-semibold text-vermilion">🍃 உணவு</dt>
                      <dd>{d.diet}</dd>
                    </dl>
                    <div>
                      <p className="font-semibold text-sm mb-1">✨ சிறப்பு</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {d.special.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--border)] p-4 bg-white/30 dark:bg-white/5 h-fit">
                    <DayChecklist day={d.n} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
