// Deterministic "tools" the specialist agents use to ground the LLM in this app's content.
import {
  ARUNAGIRI_WORKS,
  DAILY_ROUTINE,
  DAYS,
  DIET_LEVELS,
  FESTIVAL,
  FOODS,
  OTHER_BOOKS,
  PUJA_STEPS,
  RULES,
  SONGS,
  STORY,
  VERSES,
  type Day,
} from "@/data/sashti";
import { dayFor, todayIST } from "@/lib/dates";

const fmtDay = (d: Day) =>
  [
    `நாள் ${d.n} (${d.date}, ${d.weekdayTa}/${d.weekdayEn}, திதி ${d.tithi}) — ${d.titleTa} / ${d.titleEn}`,
    `படைவீடு: ${d.padaiVeedu} — ${d.padaiMeaning}`,
    `நோக்கம்: ${d.focus}`,
    `கந்த புராணம்: ${d.kandaPuranam}; கந்தர் அனுபூதி: ${d.anubhuti}; திருப்புகழ்: ${d.thiruppugazh}`,
    `ஜபம்: ${d.japam}`,
    `சிறப்பு: ${d.special.join("; ")}`,
    `உணவு: ${d.diet}`,
  ].join("\n");

/** Which viratham day(s) does the question refer to? */
export function resolveDays(question: string, today = todayIST()): Day[] {
  const q = question.toLowerCase();
  const picked = new Set<number>();
  for (const m of q.matchAll(/(?:day|நாள்)\s*(\d)/g)) picked.add(Number(m[1]));
  for (const m of q.matchAll(/(?:nov(?:ember)?|நவம்பர்)\s*(\d{1,2})|(\d{1,2})\s*(?:nov|நவம்பர்)/g)) {
    const dd = Number(m[1] ?? m[2]);
    const d = dayFor(`2026-11-${String(dd).padStart(2, "0")}`);
    if (d) picked.add(d.n);
  }
  if (/soora|சூர|samhar|சம்ஹார|sashti day|சஷ்டி அன்று/.test(q)) picked.add(6);
  if (/kalyan|கல்யாண|parana|பாரணை|break.*fast|முடி/.test(q)) picked.add(7);
  if (/tomorrow|நாளை/.test(q)) {
    const t = new Date(today + "T00:00:00Z");
    t.setUTCDate(t.getUTCDate() + 1);
    const d = dayFor(t.toISOString().slice(0, 10));
    if (d) picked.add(d.n);
  }
  if (/today|இன்று|இன்றைக்கு/.test(q) || picked.size === 0) {
    const d = dayFor(today);
    if (d) picked.add(d.n);
  }
  return DAYS.filter((d) => picked.has(d.n));
}

export function calendarContext(question: string): string {
  const today = todayIST();
  const days = resolveDays(question, today);
  const overview = DAYS.map((d) => `• நாள் ${d.n} ${d.date} ${d.weekdayTa}: ${d.titleTa} (${d.padaiVeedu})`).join("\n");
  return [
    `## நாள்காட்டி (இன்று IST: ${today})`,
    `விரதம் ${FESTIVAL.vratamStart} தொடக்கம்; சூரசம்ஹாரம் ${FESTIVAL.soorasamharam}; திருக்கல்யாணம் ${FESTIVAL.thirukalyanam}.`,
    FESTIVAL.note,
    overview,
    ...(days.length ? ["", "### தொடர்புடைய நாள் விவரம்", ...days.map(fmtDay)] : []),
  ].join("\n");
}

export function methodContext(): string {
  return [
    "## விரத முறை",
    "தினசரி அட்டவணை:\n" + DAILY_ROUTINE.map((r) => `${r.time} — ${r.ta}`).join("\n"),
    "செய்ய வேண்டியவை: " + RULES.dos.join("; "),
    "தவிர்க்க வேண்டியவை: " + RULES.donts.join("; "),
    "பூஜை படிகள்: " + PUJA_STEPS.map((p, i) => `${i + 1}. ${p.ta}`).join(" "),
    "கதை: " + STORY.paras.join(" "),
  ].join("\n\n");
}

export function dietContext(): string {
  return [
    "## உணவு",
    DIET_LEVELS.map((l) => `• ${l.name} (${l.en}) — யாருக்கு: ${l.who}; என்ன: ${l.what}`).join("\n"),
    "உண்ணலாம்: " + FOODS.eat.map((g) => `${g.cat}: ${g.items.join(", ")}`).join(" | "),
    "தவிர்க்கவும்: " + FOODS.avoid.join("; "),
    "மாதிரி நாள்: " + FOODS.sampleDay.map((s) => `${s.time} ${s.meal}`).join(" | "),
  ].join("\n");
}

export function healthContext(): string {
  return ["## உடல்நலப் பாதுகாப்பு (கட்டாயம் குறிப்பிடவும்)", ...FOODS.health].join("\n");
}

export function scriptureContext(question: string): string {
  const q = question.toLowerCase();
  const books = [...ARUNAGIRI_WORKS, ...OTHER_BOOKS];
  const keys: [RegExp, string][] = [
    [/kavas|கவச/, "கவச"],
    [/thirupp?ugazh|tiruppukal|திருப்புகழ்/, "திருப்புகழ்"],
    [/anubh?uthi|anubuti|அனுபூதி/, "அனுபூதி"],
    [/alangar|அலங்கார/, "அலங்கார"],
    [/aatrupadai|atrupadai|ஆற்றுப்படை/, "ஆற்றுப்படை"],
    [/vallalar|வள்ளலார்|deiva ?mani|தெய்வமணி/, "தெய்வமணி"],
    [/purana|புராண/, "புராண"],
    [/six face|aaru ?mugam|ஆறுமுக|ஏறுமயில்/, "ஆறுமுக"],
  ];
  const hits = keys.filter(([re]) => re.test(q)).map(([, k]) => k);
  const verses = (hits.length ? VERSES.filter((v) => hits.some((h) => v.title.includes(h))) : VERSES.slice(0, 3)).slice(0, 4);
  return [
    "## நூல்கள்",
    books.map((b) => `• ${b.title} — ${b.author}: ${b.about} (படிக்கும் முறை: ${b.how})`).join("\n"),
    "### சரிபார்க்கப்பட்ட பாடல் வரிகள் (இவற்றை மட்டும் மேற்கோள் காட்டவும்)",
    verses.map((v) => `【${v.title} — ${v.source}】\n${v.lines.filter(Boolean).join("\n")}\nபொருள்: ${v.meaning}`).join("\n\n"),
  ].join("\n");
}

export function songsContext(): string {
  return ["## பாடல்கள்", SONGS.map((s) => `• ${s.title}${s.artist ? ` — ${s.artist}` : ""} [${s.kind}] — ${s.when}`).join("\n")].join("\n");
}

/** Keyword fallback when the router LLM output can't be parsed. */
export function keywordIntents(question: string): string[] {
  const q = question.toLowerCase();
  const out = new Set<string>();
  if (/day|date|calendar|today|tomorrow|when|நாள்|தேதி|இன்று|நாளை|சூர|கல்யாண|schedule/.test(q)) out.add("calendar");
  if (/eat|food|diet|fast|milk|fruit|உணவு|சாப்பி|பால்|பழம்|உபவாச|விரதம் இருக்க/.test(q)) out.add("diet");
  if (/sugar|diabet|pressure|bp|pregnan|medicine|tablet|elder|child|சர்க்கரை|நீரிழிவு|கர்ப்ப|மருந்து|மாத்திரை|முதியோர்/.test(q)) out.add("health");
  if (/book|read|verse|lyrics|kavas|thirupp|anubh|alangar|நூல்|படி|பாடல் வரி|கவச|திருப்புகழ்|அனுபூதி/.test(q)) out.add("scripture");
  if (/song|listen|music|tms|பாடல்|கேட்க|இசை/.test(q)) out.add("songs");
  if (/how|method|puja|pooja|rule|routine|mantra|story|முறை|பூஜை|விதி|மந்திர|கதை|எப்படி/.test(q)) out.add("method");
  return [...out];
}
