import Image from "next/image";

/** Banner used on every inner page — keeps Lord Murugan's darshan always in view. */
export default function PageHero({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-vermilion via-saffron to-gold text-white shadow-xl">
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_80%_50%,white,transparent_55%)]" />
      <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-6 p-6 md:p-10">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-white/85">{kicker}</p>
          <h1 className="font-tamil font-extrabold text-3xl md:text-5xl mt-2 leading-tight drop-shadow">{title}</h1>
          {subtitle && <p className="mt-3 text-white/90 max-w-2xl text-base md:text-lg">{subtitle}</p>}
          {children}
        </div>
        <div className="justify-self-center md:justify-self-end">
          <div className="relative w-36 h-48 md:w-44 md:h-60 rounded-[2rem] p-[3px] peacock-border halo rotate-2">
            <Image
              src="/murugan.jpg"
              alt="ஆறுமுகப் பெருமான் — வள்ளி தெய்வானையுடன் மயில் மீது"
              fill
              sizes="180px"
              className="rounded-[1.8rem] object-cover object-[50%_35%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
