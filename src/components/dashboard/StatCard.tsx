import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  /** Solid green card. Use on one card only, to set the focal point. */
  featured?: boolean;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  featured = false,
}: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
        featured
          ? "border-[#005F4E] bg-[#005F4E] text-white hover:shadow-[0_10px_28px_rgba(0,95,78,0.28)]"
          : "border-[#dfe8e6] bg-white hover:border-[#c5d8d3] hover:shadow-[0_8px_24px_rgba(16,37,38,0.06)]"
      }`}
    >
      {/* Decorative watermark icon */}
      <Icon
        aria-hidden
        size={84}
        strokeWidth={1.2}
        className={`pointer-events-none absolute -bottom-5 -right-4 -rotate-12 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 ${
          featured ? "text-white/10" : "text-[#005F4E]/[0.06]"
        }`}
      />

      <div className="relative flex items-center justify-between gap-3">
        <p
          className={`text-sm font-medium ${
            featured ? "text-white/80" : "text-[#718281]"
          }`}
        >
          {title}
        </p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            featured ? "bg-white/15 text-white" : "bg-[#eef6f4] text-[#005F4E]"
          }`}
        >
          <Icon size={16} strokeWidth={1.9} />
        </div>
      </div>

      <p
        className={`relative mt-2 text-3xl font-semibold tabular-nums tracking-tight ${
          featured ? "text-white" : "text-[#102526]"
        }`}
      >
        {value}
      </p>

      <p
        className={`relative mt-0.5 text-xs ${
          featured ? "text-white/70" : "text-[#9aa9a7]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}