/**
 * Murugan Guru — a multi-agent LangGraph.
 *
 *            ┌──────────► calendar ─┐
 *            ├──────────► method  ──┤
 *  START ► router ──────► diet    ──┼──► guru (LLM, streamed) ► END
 *            ├──────────► health  ──┤
 *            ├──────────► scripture ┤
 *            └──────────► songs  ───┘
 *
 * The router (LLM classifier with keyword fallback) fans out in parallel to the
 * specialist agents it selects; each specialist grounds the answer by pulling
 * verified content from the app's knowledge base; the guru node composes the reply.
 * The Groq key is supplied per request (BYOK) and never stored server-side.
 */
import { Annotation, END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, type BaseMessage } from "@langchain/core/messages";
import {
  calendarContext,
  dietContext,
  healthContext,
  keywordIntents,
  methodContext,
  scriptureContext,
  songsContext,
} from "./knowledge";
import { todayIST } from "@/lib/dates";

export const SPECIALISTS = ["calendar", "method", "diet", "health", "scripture", "songs"] as const;
type Specialist = (typeof SPECIALISTS)[number];

const concat = <T,>(a: T[], b: T[]) => a.concat(b);

const GuruState = Annotation.Root({
  ...MessagesAnnotation.spec,
  intents: Annotation<Specialist[]>({ reducer: (_a, b) => b, default: () => [] }),
  context: Annotation<string[]>({ reducer: concat, default: () => [] }),
});
type S = typeof GuruState.State;

const lastQuestion = (msgs: BaseMessage[]) => {
  for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].getType() === "human") return String(msgs[i].content);
  return "";
};

const ROUTER_PROMPT = `You are the router of a Lord Murugan / Kanda Sashti Viratham 2026 assistant.
Pick which specialist agents are needed to answer the user's latest message:
- calendar: dates, which day it is, day-wise plan, Soorasamharam, Thirukalyanam timing
- method: how to observe the vratham, routine, puja steps, rules, mantras, the Soorasamharam story
- diet: food, fasting levels, what to eat/avoid
- health: user mentions illness, diabetes, BP, pregnancy, medication, elderly, children, dizziness
- scripture: books, Thiruppugazh, Arunagirinathar, Kavasam, Anubhuti, verses, lyrics, meanings
- songs: devotional songs / what to listen to
Reply with ONLY a JSON object like {"intents":["calendar","diet"]}. Use [] for greetings or general chat.`;

export function buildGuruGraph(opts: { apiKey: string; model: string }) {
  const llm = new ChatGroq({ apiKey: opts.apiKey, model: opts.model, temperature: 0.6, maxTokens: 1600 });
  const routerLlm = new ChatGroq({ apiKey: opts.apiKey, model: opts.model, temperature: 0, maxTokens: 60 });

  async function router(state: S): Promise<Partial<S>> {
    const q = lastQuestion(state.messages);
    let intents: Specialist[] = [];
    try {
      const res = await routerLlm.invoke([new SystemMessage(ROUTER_PROMPT), new HumanMessage(q)]);
      const json = String(res.content).match(/\{[\s\S]*\}/)?.[0];
      const parsed = json ? (JSON.parse(json).intents as string[]) : [];
      intents = parsed.filter((x): x is Specialist => (SPECIALISTS as readonly string[]).includes(x));
    } catch (e) {
      // Auth errors must surface to the user; anything else falls back to keywords.
      if (String(e).match(/401|invalid api key|invalid_api_key/i)) throw e;
    }
    const kw = keywordIntents(q) as Specialist[];
    // health guard is never left to chance
    if (kw.includes("health") && !intents.includes("health")) intents.push("health");
    if (intents.length === 0) intents = kw;
    return { intents };
  }

  const specialist =
    (fn: (q: string) => string) =>
    async (state: S): Promise<Partial<S>> => ({ context: [fn(lastQuestion(state.messages))] });

  async function guru(state: S): Promise<Partial<S>> {
    const system = `நீங்கள் "முருக குரு" — கந்த சஷ்டி விரதம் 2026 இருக்கும் பக்தர்களுக்கு அன்புடன் வழிகாட்டும் ஆன்மீக உதவியாளர்.
You are "Muruga Guru", a warm, knowledgeable guide for devotees of Lord Murugan observing Kanda Sashti Viratham 2026.
Today's date (IST): ${todayIST()}.

Rules:
- Reply in the user's language: Tamil script if they write Tamil or Tanglish-asks-for-Tamil; English if they write English. Sprinkle short Tamil devotional phrases either way.
- Ground every factual claim (dates, day plans, food, books) in the CONTEXT below. If something isn't in context and you are unsure, say so and suggest checking the local temple / panchangam.
- Only quote Tamil verses that appear verbatim in CONTEXT. Never invent or "complete" verses — instead name the work and point the user to the Library page or kaumaram.com / projectmadurai.org.
- For any health condition, put safety first: recommend a gentler fasting level and consulting a doctor; never advise stopping medication.
- Be concise and practical: short headings, bullet lists, a closing blessing such as "வேலும் மயிலும் துணை 🙏".
- Do not claim to be a priest or give astrological predictions.

CONTEXT (from the app's verified knowledge base, gathered by specialist agents: ${state.intents.join(", ") || "none"}):
${state.context.join("\n\n") || "(general conversation — no specific context)"}`;
    const res = await llm.invoke([new SystemMessage(system), ...state.messages.slice(-12)]);
    return { messages: [res] };
  }

  return new StateGraph(GuruState)
    .addNode("router", router)
    .addNode("calendar", specialist(calendarContext))
    .addNode("method", specialist(() => methodContext()))
    .addNode("diet", specialist(() => dietContext()))
    .addNode("health", specialist(() => healthContext()))
    .addNode("scripture", specialist(scriptureContext))
    .addNode("songs", specialist(() => songsContext()))
    .addNode("guru", guru)
    .addEdge(START, "router")
    .addConditionalEdges("router", (s: S) => (s.intents.length ? s.intents : ["guru"]), [...SPECIALISTS, "guru"])
    .addEdge("calendar", "guru")
    .addEdge("method", "guru")
    .addEdge("diet", "guru")
    .addEdge("health", "guru")
    .addEdge("scripture", "guru")
    .addEdge("songs", "guru")
    .addEdge("guru", END)
    .compile();
}
