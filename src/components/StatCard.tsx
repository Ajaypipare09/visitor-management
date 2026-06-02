import { LucideIcon, TrendingUp } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  tone?: "primary" | "success" | "warning" | "destructive";
}

const tones = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({ label, value, icon: Icon, delta, tone = "primary" }: Props) {
  return (
    <div className="glass group rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-success">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{delta}</span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  );
}
