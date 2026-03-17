import { ShieldCheck, Sparkles, Wifi } from "lucide-react";

const ITEMS = [
  {
    icon: Wifi,
    label: "Quick connection",
  },
  {
    icon: ShieldCheck,
    label: "Privacy respected",
  },
  {
    icon: Sparkles,
    label: "Secure guest access",
  },
];

export function TrustPills() {
  return (
    <div className="flex flex-wrap gap-3">
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-4 py-2 text-sm text-foreground shadow-soft backdrop-blur"
        >
          <item.icon className="h-4 w-4 text-primary" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
