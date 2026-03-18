import Image from "next/image";

type BrandMarkProps = {
  centered?: boolean;
  hero?: boolean;
};

export function BrandMark({ centered = false, hero = false }: BrandMarkProps) {
  return (
    <div
      className={[
        "inline-flex rounded-[2rem] border border-white/70 bg-white/78 shadow-soft backdrop-blur",
        hero ? "w-full max-w-[320px] flex-col items-center gap-3 px-6 py-5" : "items-center gap-4 px-5 py-4",
        centered ? "mx-auto justify-center text-center" : "",
      ].join(" ")}
    >
      <div className={`relative ${hero ? "h-14 w-[220px]" : "h-9 w-[132px] sm:h-10 sm:w-[148px]"}`}>
        <Image
          src="/be-home-logo.svg"
          alt="Be Home"
          fill
          className={`object-contain ${hero ? "object-center" : "object-left"}`}
          priority
        />
      </div>
      <div className={hero ? "block" : "hidden sm:block"}>
        <p className="text-xs font-semibold tracking-[0.28em] text-[#5c5545] uppercase">
          Community · Wellness · Cascais
        </p>
      </div>
    </div>
  );
}
