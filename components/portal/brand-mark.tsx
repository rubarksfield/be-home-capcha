import Image from "next/image";

export function BrandMark() {
  return (
    <div className="inline-flex items-center gap-4 rounded-[2rem] border border-white/70 bg-white/78 px-5 py-4 shadow-soft backdrop-blur">
      <div className="relative h-9 w-[132px] sm:h-10 sm:w-[148px]">
        <Image src="/be-home-logo.svg" alt="Be Home" fill className="object-contain object-left" priority />
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-semibold tracking-[0.28em] text-[#5c5545] uppercase">
          Community · Wellness · Cascais
        </p>
      </div>
    </div>
  );
}
