"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; route?: string[]; error?: boolean };

const MODELS = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (recommended)" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (fast)" },
];

const SUGGESTIONS = [
  "இன்றைய விரத நாள் திட்டம் என்ன?",
  "எனக்கு சர்க்கரை நோய் உள்ளது — எப்படி விரதம் இருப்பது?",
  "கந்தர் அனுபூதியின் ‘உருவாய் அருவாய்’ பாடலுக்குப் பொருள் சொல்லுங்கள்",
  "What should I eat on Soorasamharam day?",
  "சூரசம்ஹாரக் கதையைக் குழந்தைகளுக்குச் சொல்வது போல் சொல்லுங்கள்",
  "Suggest a song playlist for evening puja",
];

const AGENT_LABEL: Record<string, string> = {
  calendar: "📅 நாள்காட்டி",
  method: "🪔 முறை",
  diet: "🍌 உணவு",
  health: "⚕️ நலம்",
  scripture: "📜 நூல்",
  songs: "🎶 பாடல்",
};

const KEY_STORE = "sashti-groq-key";
const MODEL_STORE = "sashti-groq-model";

function readKey(): string {
  try {
    return sessionStorage.getItem(KEY_STORE) ?? localStorage.getItem(KEY_STORE) ?? "";
  } catch {
    return "";
  }
}

/** Tiny, safe markdown: headings, bullets, bold. No HTML injection. */
function Markdown({ text }: { text: string }) {
  const bold = (s: string, k: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? <strong key={k + i}>{p.slice(2, -2)}</strong> : <span key={k + i}>{p}</span>,
    );
  return (
    <div className="space-y-1.5 leading-relaxed">
      {text.split("\n").map((line, i) => {
        const k = String(i);
        if (/^#{1,4}\s/.test(line))
          return (
            <p key={k} className="font-tamil font-extrabold text-vermilion mt-2">
              {bold(line.replace(/^#+\s/, ""), k)}
            </p>
          );
        if (/^\s*[-*•]\s/.test(line))
          return (
            <p key={k} className="pl-4 relative">
              <span className="absolute left-0 text-saffron">•</span>
              {bold(line.replace(/^\s*[-*•]\s/, ""), k)}
            </p>
          );
        if (!line.trim()) return <div key={k} className="h-1" />;
        return <p key={k}>{bold(line, k)}</p>;
      })}
    </div>
  );
}

export default function GuruChat() {
  const [key, setKey] = useState("");
  const [remember, setRemember] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [showSettings, setShowSettings] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [agents, setAgents] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const k = readKey();
    setKey(k);
    try {
      setRemember(!!localStorage.getItem(KEY_STORE));
      setModel(localStorage.getItem(MODEL_STORE) ?? MODELS[0].id);
    } catch {}
    if (!k) setShowSettings(true);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const saveSettings = () => {
    try {
      sessionStorage.setItem(KEY_STORE, key.trim());
      if (remember) localStorage.setItem(KEY_STORE, key.trim());
      else localStorage.removeItem(KEY_STORE);
      localStorage.setItem(MODEL_STORE, model);
    } catch {}
    setShowSettings(false);
  };

  const forgetKey = () => {
    try {
      sessionStorage.removeItem(KEY_STORE);
      localStorage.removeItem(KEY_STORE);
    } catch {}
    setKey("");
  };

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    if (!key.trim()) {
      setShowSettings(true);
      return;
    }
    const history: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setAgents([]);
    const ac = new AbortController();
    abortRef.current = ac;

    const patch = (fn: (m: Msg) => Msg) =>
      setMsgs((cur) => cur.map((m, i) => (i === cur.length - 1 ? fn(m) : m)));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-groq-key": key.trim() },
        body: JSON.stringify({
          model,
          messages: history.filter((m) => !m.error).map(({ role, content }) => ({ role, content })),
        }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.type === "route") patch((m) => ({ ...m, route: ev.intents }));
          else if (ev.type === "agent") setAgents((a) => [...a, ev.node]);
          else if (ev.type === "token") patch((m) => ({ ...m, content: m.content + ev.text }));
          else if (ev.type === "error") patch((m) => ({ ...m, content: ev.message, error: true }));
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") patch((m) => ({ ...m, content: String((e as Error).message), error: true }));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="mt-8 grid lg:grid-cols-[1fr_18rem] gap-6">
      <div className="card flex flex-col h-[70vh] min-h-[28rem] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[color:var(--border)] bg-gradient-to-r from-peacock-deep to-peacock text-white">
          <span className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold">
            <Image src="/murugan.jpg" alt="" fill sizes="36px" className="object-cover object-[50%_32%]" />
          </span>
          <div className="leading-tight">
            <p className="font-tamil font-bold">முருக குரு</p>
            <p className="text-[11px] opacity-80">LangGraph multi-agent · Groq · {model}</p>
          </div>
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="ml-auto rounded-full bg-white/15 hover:bg-white/25 px-3 py-1 text-sm"
          >
            ⚙️ {key ? "Key ✓" : "Add key"}
          </button>
        </div>

        {showSettings && (
          <div className="p-4 border-b border-[color:var(--border)] bg-amber-400/10 space-y-3 text-sm">
            <p>
              <b>Bring your own Groq key.</b> Get a free key at{" "}
              <a className="text-peacock underline" href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
                console.groq.com/keys
              </a>
              . It stays in your browser and is sent only with your own chat requests — never stored on the server.
            </p>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="gsk_…"
              className="w-full rounded-xl border border-[color:var(--border)] bg-white/70 dark:bg-black/30 px-3 py-2 font-mono"
              autoComplete="off"
            />
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="rounded-xl border border-[color:var(--border)] bg-white/70 dark:bg-black/30 px-3 py-2"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember on this device
              </label>
              <button onClick={saveSettings} className="ml-auto rounded-full bg-gradient-to-r from-vermilion to-saffron text-white font-bold px-4 py-2">
                Save
              </button>
              {key && (
                <button onClick={forgetKey} className="rounded-full border px-3 py-2">
                  Forget key
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {msgs.length === 0 && (
            <div className="text-center py-6">
              <p className="font-tamil text-2xl font-extrabold text-gradient">வணக்கம்! 🙏</p>
              <p className="muted mt-1">விரதம், உணவு, நூல்கள், பாடல்கள் — எதையும் கேளுங்கள். Tamil or English.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-[color:var(--border)] px-3 py-1.5 text-sm hover:bg-orange-500/10 text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-[15px] ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-vermilion to-saffron text-white rounded-br-sm"
                    : m.error
                      ? "bg-rose-500/10 border border-rose-500/40 rounded-bl-sm"
                      : "bg-white/70 dark:bg-white/5 border border-[color:var(--border)] rounded-bl-sm"
                }`}
              >
                {m.role === "assistant" && m.route && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(m.route.length ? m.route : ["general"]).map((r) => (
                      <span key={r} className="text-[11px] rounded-full bg-peacock/15 text-peacock px-2 py-0.5 font-semibold">
                        {AGENT_LABEL[r] ?? "💬 பொது"}
                      </span>
                    ))}
                  </div>
                )}
                {m.role === "assistant" ? (
                  m.content ? (
                    <Markdown text={m.content} />
                  ) : (
                    <p className="muted animate-pulse font-tamil">
                      🪔 {agents.length ? `${agents.map((a) => AGENT_LABEL[a] ?? a).join(" · ")} தகவல் சேகரிக்கப்பட்டது…` : "சிந்திக்கிறேன்…"}
                    </p>
                  )
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="p-3 border-t border-[color:var(--border)] flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="முருக குருவிடம் கேளுங்கள்…"
            className="flex-1 rounded-full border border-[color:var(--border)] bg-white/70 dark:bg-black/30 px-4 py-2.5"
          />
          {busy ? (
            <button type="button" onClick={() => abortRef.current?.abort()} className="rounded-full border px-4">
              ■
            </button>
          ) : (
            <button className="rounded-full bg-gradient-to-r from-vermilion to-saffron text-white font-bold px-5">அனுப்பு</button>
          )}
        </form>
      </div>

      <aside className="card p-5 h-fit text-sm space-y-4">
        <h3 className="font-tamil font-extrabold text-lg">🔱 எப்படி வேலை செய்கிறது</h3>
        <ol className="space-y-2 list-decimal pl-5">
          <li><b>Router agent</b> உங்கள் கேள்வியைப் புரிந்து தேவையான நிபுணர்களைத் தேர்கிறது.</li>
          <li><b>Specialist agents</b> (நாள்காட்டி, முறை, உணவு, நலம், நூல், பாடல்) இணையாக இயங்கி இந்தத் தளத்தின் சரிபார்க்கப்பட்ட தகவலைச் சேகரிக்கின்றன.</li>
          <li><b>Guru agent</b> அவற்றைக் கொண்டு பதிலை உருவாக்கி நேரடியாக ஸ்ட்ரீம் செய்கிறது.</li>
        </ol>
        <p className="rounded-xl bg-peacock/10 p-3 text-xs">
          🔐 BYOK: உங்கள் Groq key உங்கள் உலாவியில் மட்டுமே. சர்வரில் சேமிக்கப்படுவதில்லை.
        </p>
        <p className="text-xs muted">AI தவறு செய்யக்கூடும். பாடல் வரிகளை ‘நூல்கள்’ பக்கத்திலும், தேதிகளைக் கோவில் அறிவிப்பிலும் சரிபார்க்கவும்.</p>
      </aside>
    </div>
  );
}
