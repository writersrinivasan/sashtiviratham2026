"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", ta: "முகப்பு", en: "Home" },
  { href: "/calendar", ta: "நாள்காட்டி", en: "Calendar" },
  { href: "/method", ta: "விரத முறை", en: "Method" },
  { href: "/diet", ta: "உணவு", en: "Diet" },
  { href: "/library", ta: "நூல்கள்", en: "Scriptures" },
  { href: "/songs", ta: "பாடல்கள்", en: "Songs" },
  { href: "/guru", ta: "AI குரு", en: "Ask Guru" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--bg)]/80 border-b border-[color:var(--border)]">
      <div className="h-1 w-full bg-gradient-to-r from-vermilion via-saffron to-gold" />
      <nav className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="relative block w-11 h-11 rounded-full p-[2px] peacock-border">
            <Image
              src="/murugan.jpg"
              alt="முருகன்"
              width={44}
              height={44}
              className="rounded-full w-full h-full object-cover object-[50%_32%]"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block font-tamil font-extrabold text-lg text-gradient">கந்த சஷ்டி 2026</span>
            <span className="block text-[11px] muted tracking-wide">வேலும் மயிலும் துணை</span>
          </span>
        </Link>
        <button
          className="ml-auto md:hidden rounded-full px-3 py-1.5 border border-[color:var(--border)] text-sm"
          onClick={() => setOpen((o) => !o)}
          aria-label="menu"
        >
          {open ? "✕" : "☰"}
        </button>
        <ul className="ml-auto hidden md:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-vermilion to-saffron text-white shadow"
                      : "hover:bg-orange-500/10"
                  } ${l.href === "/guru" && !active ? "ring-1 ring-peacock/50 text-peacock" : ""}`}
                >
                  {l.ta}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {open && (
        <ul className="md:hidden px-4 pb-3 grid grid-cols-2 gap-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-2 text-sm font-semibold card ${path === l.href ? "ring-2 ring-saffron" : ""}`}
              >
                {l.ta} <span className="muted text-xs">· {l.en}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
