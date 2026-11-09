import type { Metadata } from "next";
import { Mukta_Malar, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const serifTamil = Noto_Serif_Tamil({
  subsets: ["tamil", "latin"],
  weight: ["400", "600", "800"],
  variable: "--font-noto-serif-tamil",
});
const mukta = Mukta_Malar({
  subsets: ["tamil", "latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-mukta",
});

export const metadata: Metadata = {
  title: "கந்த சஷ்டி விரதம் 2026 · Murugan Companion",
  description:
    "கந்த சஷ்டி விரதம் 2026 — நாள்காட்டி, விரத முறை, உணவு, திருப்புகழ், அருணகிரிநாதர் நூல்கள், பக்திப் பாடல்கள் & AI குருவுடன் ஒரு முழுமையான முருக பக்தர் வழிகாட்டி.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <body className={`${serifTamil.variable} ${mukta.variable} antialiased min-h-screen flex flex-col`}>
        <Nav />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
