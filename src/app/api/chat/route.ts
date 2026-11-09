import { AIMessage, HumanMessage, type AIMessageChunk } from "@langchain/core/messages";
import { buildGuruGraph } from "@/lib/agent/graph";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMsg = { role: "user" | "assistant"; content: string };

const MODEL_RE = /^[\w.\-/:]{1,80}$/;

export async function POST(req: Request) {
  // BYOK: the key arrives per request from the user's browser and is never persisted or logged.
  const apiKey = req.headers.get("x-groq-key")?.trim();
  if (!apiKey) return Response.json({ error: "Groq API key missing. Add it in ⚙️ settings." }, { status: 401 });

  let body: { messages?: ChatMsg[]; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const model = body.model && MODEL_RE.test(body.model) ? body.model : "llama-3.3-70b-versatile";
  const history = (body.messages ?? [])
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m) => (m.role === "user" ? new HumanMessage(m.content.slice(0, 4000)) : new AIMessage(m.content.slice(0, 6000))));
  if (!history.length) return Response.json({ error: "Empty message" }, { status: 400 });

  const graph = buildGuruGraph({ apiKey, model });
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      try {
        const events = await graph.stream({ messages: history }, { streamMode: ["updates", "messages"], signal: req.signal });
        for await (const [mode, payload] of events as AsyncIterable<[string, unknown]>) {
          if (mode === "updates") {
            const upd = payload as Record<string, { intents?: string[] }>;
            if (upd.router) send({ type: "route", intents: upd.router.intents ?? [] });
            else for (const node of Object.keys(upd)) if (node !== "guru") send({ type: "agent", node });
          } else if (mode === "messages") {
            const [chunk, meta] = payload as [AIMessageChunk, { langgraph_node?: string }];
            if (meta?.langgraph_node === "guru" && typeof chunk.content === "string" && chunk.content)
              send({ type: "token", text: chunk.content });
          }
        }
        send({ type: "done" });
      } catch (e) {
        const msg = String((e as Error)?.message ?? e);
        const friendly = /401|invalid api key|invalid_api_key/i.test(msg)
          ? "Groq API key தவறானது — Invalid Groq API key. Please check it in ⚙️ settings."
          : /429|rate/i.test(msg)
            ? "Groq rate limit reached. Please wait a moment and try again."
            : /model.*(not found|decommissioned|does not exist)/i.test(msg)
              ? `Model "${model}" is unavailable on Groq. Pick another model in ⚙️ settings.`
              : "Something went wrong talking to Groq: " + msg.slice(0, 200);
        send({ type: "error", message: friendly });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
