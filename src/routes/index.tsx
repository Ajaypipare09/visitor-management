import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  UserPlus,
  LogIn,
  QrCode,
  Users,
  Ticket,
  Clock,
  Building2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PMRDLogo } from "@/components/PMRDLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PMRD Smart Visitor Management System" },
      {
        name: "description",
        content: "Secure, fast and digital visitor entry system for PMRD government offices.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative blurred government building backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-95" />
        <svg
          className="absolute bottom-0 left-1/2 w-[140%] max-w-none -translate-x-1/2 opacity-20 blur-sm"
          viewBox="0 0 1400 400"
          preserveAspectRatio="xMidYEnd meet"
        >
          <g fill="white">
            <rect x="100" y="200" width="1200" height="200" />
            <polygon points="700,40 200,200 1200,200" />
            <g>
              {Array.from({ length: 14 }).map((_, i) => (
                <rect key={i} x={180 + i * 80} y={120} width={20} height={80} />
              ))}
            </g>
            <rect x="660" y="240" width="80" height="160" fill="oklch(0.4 0.1 250)" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,oklch(0.15_0.05_260)_100%)]" />
      </div>

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 md:px-12 md:py-5">
        <PMRDLogo variant="light" />
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <LogIn className="mr-1.5 h-4 w-4" /> {t("login")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-10 text-center md:px-6 md:pt-20">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" />
          Digital India Initiative · Govt. Verified
        </div>
        <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-white/75 md:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full rounded-full bg-white px-7 text-primary hover:bg-white/90"
            >
              <UserPlus className="mr-2 h-4 w-4" /> {t("newRegistration")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full border-white/30 bg-white/5 px-7 text-white backdrop-blur hover:bg-white/15"
            >
              <LogIn className="mr-2 h-4 w-4" /> {t("login")}
            </Button>
          </Link>
          <Link to="/pass" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="ghost"
              className="w-full rounded-full px-7 text-white hover:bg-white/10"
            >
              <QrCode className="mr-2 h-4 w-4" /> {t("trackPass")}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-4 md:grid-cols-3">
          {[
            { icon: Users, label: t("todayVisitors"), value: "1,284", trend: "+12%" },
            { icon: Ticket, label: t("activePasses"), value: "342", trend: "+5%" },
            { icon: Clock, label: t("pendingApprovals"), value: "27", trend: "−8%" },
          ].map((s, i) => (
            <div key={i} className="glass-dark rounded-2xl p-6 text-left">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-300">{s.trend}</span>
              </div>
              <p className="mt-4 text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature row */}
        <div className="mt-16 grid gap-4 text-left md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Instant QR Passes",
              desc: "Generate verifiable entry passes in seconds.",
            },
            {
              icon: ShieldCheck,
              title: "Aadhaar Verified",
              desc: "OTP based KYC for tamper-proof identity.",
            },
            {
              icon: Building2,
              title: "Multi-Department",
              desc: "Route visits to the right officer automatically.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <f.icon className="h-5 w-5 text-white/80" />
              <h3 className="mt-3 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-xs text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Panchayat & Rural Development · Government of Maharashtra
      </footer>
    </div>
  );
}
