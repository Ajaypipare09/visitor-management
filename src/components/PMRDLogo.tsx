export function PMRDLogo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const text = variant === "light" ? "text-white" : "text-foreground";
  const sub = variant === "light" ? "text-white/70" : "text-muted-foreground";

  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-glow ring-1 ring-border/40">
        <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="6"
            transform="rotate(45 32 32)"
            fill="none"
            stroke="#cb173c"
            strokeWidth="7"
          />
          <rect
            x="20"
            y="20"
            width="24"
            height="24"
            rx="4"
            transform="rotate(45 32 32)"
            fill="#0d4f91"
          />
          <path
            d="M24 34c2.3 4 8.2 6.2 13.4 4.1 2-0.8 3.6-2.2 4.6-4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <circle cx="26.5" cy="29.5" r="1.6" fill="#ffffff" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={`text-sm font-bold tracking-wide ${text}`}>PMRD</div>
        <div className={`text-[10px] uppercase tracking-[0.15em] ${sub}`}>Govt. of India</div>
      </div>
    </div>
  );
}
