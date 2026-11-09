import PageHero from "@/components/PageHero";
import GuruChat from "./GuruChat";

export const metadata = { title: "AI குரு · கந்த சஷ்டி 2026" };

export default function GuruPage() {
  return (
    <>
      <PageHero
        kicker="Agentic AI · LangGraph + Groq (BYOK)"
        title="முருக குருவிடம் கேளுங்கள்"
        subtitle="விரத நாள் திட்டம், உடல்நிலைக்கேற்ற உணவு, திருப்புகழ் பொருள், பாடல் பட்டியல் — தமிழிலோ ஆங்கிலத்திலோ கேளுங்கள்."
      />
      <GuruChat />
    </>
  );
}
