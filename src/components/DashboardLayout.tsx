import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarPlus, Ticket, LogOut, Bell, Search } from "lucide-react";
import { ReactNode } from "react";
import { PMRDLogo } from "./PMRDLogo";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/lib/i18n";

const nav = [
  { to: "/appointment", icon: CalendarPlus, key: "bookAppointment" as const },
  { to: "/pass", icon: Ticket, key: "myPasses" as const },
];

export function DashboardLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { t } = useI18n();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border p-5">
          <PMRDLogo variant="light" />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                <span>{t(item.key)}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4.5 w-4.5" />
            {t("logout")}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-8">
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search visitors, departments..."
              className="h-10 w-full rounded-full border border-border/60 bg-secondary/60 pl-10 pr-4 text-sm outline-none transition focus:border-ring focus:bg-background"
            />
          </div>
          <div className="flex-1 md:hidden" />
          <LanguageToggle />
          <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-card transition hover:bg-secondary">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card px-2 py-1.5 pr-3">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-accent-gradient text-xs font-bold text-white">
              RP
            </div>
            <div className="hidden text-left leading-tight md:block">
              <div className="text-xs font-semibold">Rahul Patil</div>
              <div className="text-[10px] text-muted-foreground">Verified Citizen</div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 pb-24 md:px-8 md:pb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
          <div className="grid grid-cols-2 gap-2 p-2">
            {nav.map((item) => {
              const active = path === item.to;
              return (
                <Link
                  key={`mobile-${item.to}`}
                  to={item.to}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{t(item.key)}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
