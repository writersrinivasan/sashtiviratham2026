import PageHero from "@/components/PageHero";
import { SONGS, yt } from "@/data/sashti";

export const metadata = { title: "பாடல்கள் · கந்த சஷ்டி 2026" };

const KIND_COLOR: Record<string, string> = {
  "பாராயணம்": "from-rose-500 to-orange-500",
  "திருப்புகழ்": "from-amber-500 to-yellow-400",
  "அருணகிரிநாதர்": "from-orange-500 to-red-500",
  "பக்திப் பாடல்": "from-indigo-500 to-fuchsia-500",
  "சொற்பொழிவு": "from-emerald-500 to-teal-600",
  "சங்க இலக்கியம்": "from-cyan-600 to-blue-600",
};

const PLAYLIST = [
  { slot: "🌅 அதிகாலை", items: ["கந்த சஷ்டி கவசம்", "அழகென்ற சொல்லுக்கு முருகா", "ஸ்கந்த குரு கவசம்"] },
  { slot: "☀️ மதியம்", items: ["கந்த புராண விரிவுரை", "கந்தர் அனுபூதி (இசையுடன்)"] },
  { slot: "🌇 மாலை", items: ["திருப்புகழ் பஜனை", "கற்பனை என்றாலும் கற்சிலை என்றாலும்", "மருதமலை மாமணியே முருகய்யா"] },
  { slot: "🌙 இரவு", items: ["உள்ளம் உருகுதைய்யா", "கந்த சஷ்டி கவசம்"] },
];

export default function SongsPage() {
  const kinds = Array.from(new Set(SONGS.map((s) => s.kind)));
  return (
    <>
      <PageHero
        kicker="Devotional listening"
        title="கேட்க வேண்டிய பக்திப் பாடல்கள்"
        subtitle="கவசம், திருப்புகழ், அருணகிரிநாதர் பாடல்கள், TMS முதலிய பாடகர்களின் பக்திப் பாடல்கள் — எப்போது கேட்பது என்ற வழிகாட்டியுடன்."
      />

      <section className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLAYLIST.map((p) => (
          <div key={p.slot} className="card p-5">
            <h3 className="font-tamil font-extrabold text-lg">{p.slot}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {p.items.map((i) => (
                <li key={i}>
                  <a href={yt(i)} target="_blank" rel="noreferrer" className="hover:text-vermilion">
                    ▶ {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {kinds.map((k) => (
        <section key={k} className="mt-10">
          <h2 className="font-tamil text-xl font-extrabold mb-3 flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-br ${KIND_COLOR[k] ?? "from-saffron to-vermilion"}`} />
            {k}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SONGS.filter((s) => s.kind === k).map((s) => (
              <a
                key={s.title}
                href={yt(`${s.title} ${s.artist ?? "முருகன்"}`)}
                target="_blank"
                rel="noreferrer"
                className="group card p-4 flex gap-3 items-center hover:-translate-y-0.5 transition"
              >
                <span className={`shrink-0 w-12 h-12 rounded-2xl grid place-items-center text-white text-xl bg-gradient-to-br ${KIND_COLOR[k] ?? "from-saffron to-vermilion"} shadow`}>
                  ▶
                </span>
                <span className="min-w-0">
                  <span className="block font-tamil font-bold leading-snug group-hover:text-vermilion">{s.title}</span>
                  {s.artist && <span className="block text-xs muted">{s.artist}</span>}
                  <span className="block text-xs text-peacock font-semibold mt-0.5">🕰 {s.when}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-8 text-xs muted text-center">
        ஒவ்வொரு பாடலும் YouTube தேடலில் திறக்கும் — அதிகாரப்பூர்வ / நம்பகமான சேனல்களைத் தேர்ந்தெடுங்கள்.
      </p>
    </>
  );
}
