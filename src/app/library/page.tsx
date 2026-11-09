import PageHero from "@/components/PageHero";
import { ARUNAGIRI_WORKS, OTHER_BOOKS, READING_LINKS, VERSES, type Book } from "@/data/sashti";

export const metadata = { title: "நூல்கள் · கந்த சஷ்டி 2026" };

function BookCard({ b, accent }: { b: Book; accent: string }) {
  return (
    <article className="card p-5 flex flex-col">
      <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${accent} mb-3`} />
      <h3 className="font-tamil font-extrabold text-lg leading-snug">{b.title}</h3>
      <p className="text-sm text-vermilion font-semibold">
        {b.author}
        {b.era && <span className="muted font-normal"> · {b.era}</span>}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed">{b.about}</p>
      <p className="mt-2 text-sm rounded-lg bg-peacock/10 px-3 py-2">
        <b>📖 எப்படிப் படிப்பது:</b> {b.how}
      </p>
      {b.link && (
        <a href={b.link} target="_blank" rel="noreferrer" className="mt-3 text-sm font-semibold text-peacock hover:underline">
          முழு நூல் படிக்க →
        </a>
      )}
    </article>
  );
}

export default function LibraryPage() {
  return (
    <>
      <PageHero
        kicker="Sacred texts of Lord Murugan"
        title="முருகன் நூல்கள் & பாடல் வரிகள்"
        subtitle="அருணகிரிநாதர் முதல் வள்ளலார் வரை — விரதக் காலத்தில் படிக்க வேண்டிய நூல்களும், மனப்பாடம் செய்ய வேண்டிய பாடல்களும்."
      />

      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {[
          ["#verses", "பாடல் வரிகள்"],
          ["#arunagiri", "அருணகிரிநாதர்"],
          ["#others", "பிற நூல்கள்"],
          ["#links", "இணைப்புகள்"],
        ].map(([h, t]) => (
          <a key={h} href={h} className="rounded-full card px-4 py-1.5 font-semibold hover:text-vermilion">
            {t}
          </a>
        ))}
      </nav>

      <section id="verses" className="mt-10 scroll-mt-24">
        <h2 className="font-tamil text-2xl font-extrabold mb-4">🌺 பாராயணப் பாடல்கள்</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {VERSES.map((v) => (
            <article key={v.title} className="card overflow-hidden">
              <header className="px-5 py-3 bg-gradient-to-r from-peacock-deep via-peacock to-teal-500 text-white">
                <h3 className="font-tamil font-bold">{v.title}</h3>
                <p className="text-xs opacity-85">{v.source}</p>
              </header>
              <div className="px-5 py-4 font-tamil text-[17px] verse-line bg-gradient-to-b from-amber-100/40 to-transparent dark:from-amber-300/5">
                {v.lines.map((l, i) => (l ? <p key={i}>{l}</p> : <br key={i} />))}
              </div>
              <p className="px-5 pb-5 text-sm muted leading-relaxed">
                <b className="text-saffron">பொருள்:</b> {v.meaning}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="arunagiri" className="mt-12 scroll-mt-24">
        <h2 className="font-tamil text-2xl font-extrabold">🪷 அருணகிரிநாதர் அருளிய நூல்கள்</h2>
        <p className="muted text-sm mb-4">திருவண்ணாமலையில் முருகனால் ஆட்கொள்ளப்பட்ட அருளாளர் — ‘வாக்கிற்கு அருணகிரி’</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARUNAGIRI_WORKS.map((b) => (
            <BookCard key={b.title} b={b} accent="from-vermilion to-gold" />
          ))}
        </div>
      </section>

      <section id="others" className="mt-12 scroll-mt-24">
        <h2 className="font-tamil text-2xl font-extrabold mb-4">📚 பிற முருகன் நூல்கள்</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OTHER_BOOKS.map((b) => (
            <BookCard key={b.title} b={b} accent="from-peacock to-indigo-500" />
          ))}
        </div>
      </section>

      <section id="links" className="mt-12 card p-6 scroll-mt-24">
        <h2 className="font-tamil text-xl font-extrabold mb-3">🔗 முழு நூல்களைப் படிக்க</h2>
        <ul className="space-y-2">
          {READING_LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer" className="text-peacock font-semibold hover:underline">
                {l.name} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
