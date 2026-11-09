# கந்த சஷ்டி விரதம் 2026 — Murugan Companion

A Next.js 15 app for devotees observing Kanda Sashti Viratham 2026
(10 Nov → Soorasamharam 15 Nov → Thirukalyanam 16 Nov).

## Pages
| Route | Content |
|---|---|
| `/` | Hero darshan, live countdown to Soorasamharam, today's plan, mantras, story |
| `/calendar` | 7-day plan (Padai Veedu, Kanda Puranam kandam, Anubhuti verses, Thiruppugazh, japam, diet) + daily checklist saved in the browser |
| `/method` | Daily timetable, do's & don'ts, home puja steps, sankalpam, parana |
| `/diet` | 4 fasting levels, foods to eat/avoid, sample day, health safety |
| `/library` | Tamil verses with meaning, Arunagirinathar's works, other Murugan texts, reading links |
| `/songs` | Kavasam, Thiruppugazh, devotional songs (YouTube search links) with when-to-listen guide |
| `/guru` | AI assistant — LangGraph multi-agent over Groq, BYOK |

## AI Guru (LangGraph)
`src/lib/agent/graph.ts`: `router` (LLM classifier + keyword fallback + forced health guard)
fans out in parallel to specialist nodes (`calendar`, `method`, `diet`, `health`, `scripture`, `songs`)
that pull verified content from `src/data/sashti.ts`; `guru` composes and streams the answer.
`/api/chat` streams NDJSON events (`route`, `agent`, `token`, `done`, `error`).

**BYOK:** the user's Groq key is kept in their browser (session, or local if "remember" is ticked)
and sent per request in the `x-groq-key` header. The server never stores or logs it.

## Run
```bash
npm install
npm run dev     # http://localhost:3000
```
Edit all devotional content in `src/data/sashti.ts`.

Image: Raja Ravi Varma, "Murugan" — public domain, via Wikimedia Commons.
