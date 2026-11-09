import PageHero from "@/components/PageHero";
import { DAILY_ROUTINE, PUJA_STEPS, RULES } from "@/data/sashti";

export const metadata = { title: "விரத முறை · கந்த சஷ்டி 2026" };

export default function MethodPage() {
  return (
    <>
      <PageHero
        kicker="How to live these seven days"
        title="விரத முறை — வாழும் வழி"
        subtitle="விரதம் என்பது உணவைக் குறைப்பது மட்டுமல்ல; சொல், செயல், சிந்தனை மூன்றையும் முருகனுக்கு அர்ப்பணிப்பது."
      />

      <section className="mt-10">
        <h2 className="font-tamil text-2xl font-extrabold mb-4">🕉️ தினசரி கால அட்டவணை</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAILY_ROUTINE.map((r) => (
            <li key={r.time} className="card p-4 flex gap-3 items-start">
              <span className="text-2xl">{r.icon}</span>
              <div>
                <p className="text-xs font-bold text-saffron tabular-nums">{r.time}</p>
                <p className="font-tamil font-semibold leading-snug">{r.ta}</p>
                <p className="text-xs muted">{r.en}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="card p-6 border-l-4 border-l-emerald-500">
          <h2 className="font-tamil text-xl font-extrabold mb-3 text-emerald-600">✔ செய்ய வேண்டியவை</h2>
          <ul className="space-y-2">
            {RULES.dos.map((x) => (
              <li key={x} className="flex gap-2"><span>🌼</span><span>{x}</span></li>
            ))}
          </ul>
        </div>
        <div className="card p-6 border-l-4 border-l-rose-500">
          <h2 className="font-tamil text-xl font-extrabold mb-3 text-rose-600">✘ தவிர்க்க வேண்டியவை</h2>
          <ul className="space-y-2">
            {RULES.donts.map((x) => (
              <li key={x} className="flex gap-2"><span>🚫</span><span>{x}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 card p-6">
        <h2 className="font-tamil text-2xl font-extrabold mb-1">🪔 வீட்டுப் பூஜை முறை</h2>
        <p className="muted text-sm mb-5">காலையும் மாலையும் — 20 முதல் 40 நிமிடங்கள்</p>
        <ol className="grid md:grid-cols-2 gap-3">
          {PUJA_STEPS.map((p, i) => (
            <li key={i} className="flex gap-3 items-start rounded-xl p-3 bg-gradient-to-r from-orange-500/10 to-transparent">
              <span className="shrink-0 w-8 h-8 rounded-full grid place-items-center bg-gradient-to-br from-vermilion to-saffron text-white font-bold text-sm">
                {i + 1}
              </span>
              <div>
                <p className="font-tamil font-semibold">{p.ta}</p>
                <p className="text-xs muted">{p.en}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid md:grid-cols-3 gap-4">
        {[
          { t: "சங்கல்பம் (முதல் நாள்)", b: "“முருகப் பெருமானே, இந்தக் கந்த சஷ்டி நன்னாளில் ஆறு நாள் விரதம் இருந்து உன்னை வழிபட உறுதி கொள்கிறேன். என் உடலையும் மனதையும் காத்து, இவ்விரதத்தை நிறைவேற்ற அருள் புரிவாய்.”", c: "from-amber-400 to-orange-500" },
          { t: "சூரசம்ஹார நாள்", b: "கோவிலில் அல்லது நேரலையில் சம்ஹாரம் காணுங்கள். சம்ஹாரத்திற்குப் பின் கடல்/நீர்நிலை அல்லது வீட்டில் நீராடி அபிஷேகம் தரிசியுங்கள். ‘என் ஆணவம், கன்மம், மாயை அழியட்டும்’ என்று பிரார்த்தியுங்கள்.", c: "from-rose-500 to-red-600" },
          { t: "பாரணை (விரதம் முடித்தல்)", b: "திருக்கல்யாணம் அன்று காலை நீராடி நைவேத்தியம் செய்து, ஒருவருக்கு உணவளித்துப் பின் துளசி தீர்த்தம், பால் அருந்தி எளிய உணவுடன் விரதம் நிறைவு செய்யுங்கள். சிலர் சம்ஹாரத்திற்குப் பின் இரவே நிறைவு செய்வர் — குடும்ப மரபைப் பின்பற்றுங்கள்.", c: "from-fuchsia-500 to-pink-500" },
        ].map((x) => (
          <div key={x.t} className="card overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${x.c}`} />
            <div className="p-5">
              <h3 className="font-tamil font-extrabold text-lg">{x.t}</h3>
              <p className="mt-2 font-tamil leading-loose text-[15px]">{x.b}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 card p-6 bg-gradient-to-br from-peacock/10 to-transparent">
        <h2 className="font-tamil text-xl font-extrabold">🌿 வேலைக்குச் செல்வோருக்கு</h2>
        <ul className="mt-3 grid md:grid-cols-2 gap-2 text-[15px] list-disc pl-5">
          <li>காலை கவசம் (12 நிமிடம்) + பயணத்தில் பாடல்கள் கேளுங்கள்</li>
          <li>அலுவலக மதிய உணவு: வீட்டிலிருந்து எளிய சாத்விக உணவு / பழம்</li>
          <li>இடைவேளையில் 2 நிமிடம் கண்மூடி ‘ஓம் சரவணபவ’</li>
          <li>மாலை வீடு திரும்பியதும் விளக்கு, கவசம், கோவில்</li>
          <li>சூரசம்ஹாரம் ஞாயிறு — குடும்பத்துடன் கோவில் செல்ல வசதி</li>
          <li>வேலையை நேர்மையாகச் செய்வதே ஒரு வழிபாடு</li>
        </ul>
      </section>
    </>
  );
}
