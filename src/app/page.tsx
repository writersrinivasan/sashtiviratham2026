import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import TodayCard from "@/components/TodayCard";
import { DAYS, FESTIVAL, MANTRAS, STORY } from "@/data/sashti";
import { prettyDate } from "@/lib/dates";

const TILES = [
  { href: "/calendar", icon: "📅", ta: "7 நாள் நாள்காட்டி", en: "Day-by-day plan with checklist", c: "from-rose-500 to-orange-500" },
  { href: "/method", icon: "🪔", ta: "விரத முறை", en: "Daily routine, puja & rules", c: "from-orange-500 to-amber-400" },
  { href: "/diet", icon: "🍌", ta: "உணவு முறை", en: "What to eat & avoid", c: "from-emerald-500 to-teal-600" },
  { href: "/library", icon: "📜", ta: "நூல்கள் & பாடல் வரிகள்", en: "Thiruppugazh, Anubhuti, Kavasam", c: "from-teal-600 to-cyan-600" },
  { href: "/songs", icon: "🎶", ta: "பக்திப் பாடல்கள்", en: "What to listen, when", c: "from-indigo-500 to-purple-600" },
  { href: "/guru", icon: "🔱", ta: "AI குரு", en: "LangGraph agent · your Groq key", c: "from-fuchsia-600 to-rose-500" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-night via-peacock-deep to-peacock text-white shadow-2xl">
        <div className="absolute -right-24 -top-24 w-[34rem] h-[34rem] rounded-full opacity-30 peacock-border spin-slow blur-2xl" />
        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-8 p-6 md:p-12 items-center">
          <div>
            <p className="text-gold font-semibold tracking-[0.25em] text-xs uppercase">Skanda Sashti Viratham · 2026</p>
            <h1 className="font-tamil font-extrabold text-4xl md:text-6xl mt-3 leading-[1.15]">
              கந்த சஷ்டி
              <br />
              <span className="text-gradient">விரதம் 2026</span>
            </h1>
            <p className="mt-4 text-white/85 max-w-xl text-lg">
              {prettyDate(FESTIVAL.vratamStart)} முதல் {prettyDate(FESTIVAL.soorasamharam)} சூரசம்ஹாரம் வரை — ஆறு நாள் தவம்,
              ஏழாம் நாள் திருக்கல்யாணம். நாள்காட்டி, வழிபாட்டு முறை, உணவு, திருப்புகழ், பாடல்கள் — எல்லாம் ஒரே இடத்தில்.
            </p>
            <div className="mt-6">
              <p className="text-sm text-white/75 mb-2 font-tamil">சூரசம்ஹாரத்திற்கு இன்னும்…</p>
              <Countdown />
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/calendar" className="rounded-full bg-gradient-to-r from-vermilion to-saffron px-6 py-3 font-bold shadow-lg hover:scale-[1.03] transition">
                நாள்காட்டியைத் திற →
              </Link>
              <Link href="/guru" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10 transition">
                🔱 AI குருவிடம் கேள்
              </Link>
            </div>
          </div>
          <div className="justify-self-center">
            <div className="relative w-64 h-[22rem] md:w-80 md:h-[27rem] rounded-[2.5rem] p-1 peacock-border halo">
              <Image
                src="/murugan.jpg"
                alt="ஆறுமுகப் பெருமான் வள்ளி தெய்வானையுடன் மயில் வாகனத்தில் — ராஜா ரவிவர்மா"
                fill
                priority
                sizes="(min-width: 768px) 320px, 256px"
                className="rounded-[2.3rem] object-cover"
              />
            </div>
            <p className="text-center mt-3 font-tamil text-gold text-lg">ஓம் சரவணபவ</p>
          </div>
        </div>
      </section>

      {/* Today */}
      <section className="mt-10">
        <h2 className="font-tamil text-2xl font-extrabold mb-4">இன்றைய திருநாள்</h2>
        <TodayCard />
      </section>

      {/* Tiles */}
      <section className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
        {TILES.map((t) => (
          <Link key={t.href} href={t.href} className="group card p-5 hover:-translate-y-1 transition">
            <span className={`inline-grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br ${t.c} text-2xl shadow`}>
              {t.icon}
            </span>
            <h3 className="font-tamil font-bold text-lg mt-3 group-hover:text-vermilion">{t.ta}</h3>
            <p className="text-sm muted">{t.en}</p>
          </Link>
        ))}
      </section>

      {/* Timeline strip */}
      <section className="mt-10 card p-5 overflow-x-auto">
        <h2 className="font-tamil text-xl font-extrabold mb-4">ஏழு நாள் பயணம்</h2>
        <ol className="flex gap-3 min-w-max">
          {DAYS.map((d) => (
            <li key={d.n}>
              <Link href={`/calendar#day-${d.n}`} className={`block w-40 rounded-2xl p-4 text-white bg-gradient-to-br ${d.color} hover:scale-[1.03] transition`}>
                <p className="text-xs opacity-90">
                  {prettyDate(d.date)} · {d.weekdayTa}
                </p>
                <p className="text-3xl font-extrabold">{d.n}</p>
                <p className="font-tamil text-sm font-semibold leading-snug">{d.padaiVeedu}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Mantras + story */}
      <section className="mt-10 grid md:grid-cols-[1fr_1.4fr] gap-6">
        <div className="card p-6">
          <h2 className="font-tamil text-xl font-extrabold mb-4">மந்திரங்கள்</h2>
          <ul className="space-y-3">
            {MANTRAS.map((m) => (
              <li key={m.ta} className="rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent p-3">
                <p className="font-tamil text-lg font-bold text-vermilion">{m.ta}</p>
                <p className="text-xs muted">{m.en}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="font-tamil text-xl font-extrabold mb-4">{STORY.title}</h2>
          <div className="space-y-3 font-tamil leading-loose text-[15px]">
            {STORY.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <p className="mt-6 text-xs muted text-center">{FESTIVAL.note}</p>
    </>
  );
}
