export function BrandMark() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-soft backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8dcc8] text-sm font-semibold text-[#556248]">
        BH
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.18em] text-[#556248] uppercase">Be Home</p>
        <p className="text-xs text-muted-foreground">Community · Wellness · Cascais</p>
      </div>
    </div>
  );
}
