import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { QRDisplay } from "@/components/QRDisplay";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  type LucideIcon,
  MapPin,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/pass")({
  head: () => ({ meta: [{ title: "Visitor Pass - PMRD" }] }),
  component: Pass,
});

type PassData = {
  department: string;
  officer: string;
  floor: string;
  date: string;
  slot: string;
  photoUrl?: string;
};

const defaultPassData: PassData = {
  department: "PMRD",
  officer: "Mr. Suresh Patil (Joint Secretary)",
  floor: "2nd Floor",
  date: "2026-05-22",
  slot: "10:00",
  photoUrl: "",
};

function Pass() {
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 34 * 60);
  const [isScanned, setIsScanned] = useState(false);
  const [passData, setPassData] = useState<PassData>(defaultPassData);
  const [qrSize, setQrSize] = useState(200);

  const markScanned = () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem("pmrd-pass-scanned", "1");
    window.dispatchEvent(new Event("pmrd-pass-scanned"));
    toast.success("Pass scanned. Status updated to Approved.");
  };

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncQrSize = () => {
      setQrSize(window.innerWidth < 640 ? 132 : 190);
    };

    syncQrSize();
    window.addEventListener("resize", syncQrSize);
    return () => window.removeEventListener("resize", syncQrSize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncStatus = () => {
      setIsScanned(localStorage.getItem("pmrd-pass-scanned") === "1");

      const storedPassData = localStorage.getItem("pmrd-pass-data");
      if (storedPassData) {
        try {
          const parsed = JSON.parse(storedPassData) as PassData;
          setPassData({ ...defaultPassData, ...parsed });
        } catch {
          setPassData(defaultPassData);
        }
      }
    };

    syncStatus();

    window.addEventListener("storage", syncStatus);
    window.addEventListener("pmrd-pass-scanned", syncStatus as EventListener);

    return () => {
      window.removeEventListener("storage", syncStatus);
      window.removeEventListener("pmrd-pass-scanned", syncStatus as EventListener);
    };
  }, []);

  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const passDateLabel = useMemo(() => {
    const parsed = new Date(passData.date);
    if (Number.isNaN(parsed.getTime())) {
      return passData.date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [passData.date]);

  const slotEndHour = useMemo(() => {
    const [hourText] = passData.slot.split(":");
    const hour = Number(hourText);
    if (Number.isNaN(hour)) {
      return "12:00";
    }

    return `${String(Math.min(hour + 2, 23)).padStart(2, "0")}:00`;
  }, [passData.slot]);

  return (
    <DashboardLayout
      title="Your visitor pass"
      subtitle="Pass becomes approved only after QR scan at security desk."
    >
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-2xl bg-hero-gradient p-1 shadow-elevated sm:rounded-3xl">
          <div className="rounded-[1.1rem] bg-white p-3 sm:rounded-[1.4rem] sm:p-6">
            <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground">
                PMRD - VISITOR PASS
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
                  isScanned ? "bg-success/10 text-success" : "bg-warning/20 text-warning-foreground"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> {isScanned ? "Approved" : "Awaiting Scan"}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-accent-gradient text-lg font-bold text-white shadow-glow sm:h-16 sm:w-16 sm:rounded-2xl sm:text-xl">
                {passData.photoUrl ? (
                  <img
                    src={passData.photoUrl}
                    alt="Visitor"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "RP"
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Visitor
                </div>
                <div className="text-base font-bold sm:text-lg">Rahul Patil</div>
                <div className="text-xs text-muted-foreground">Pass ID - FP-2841</div>
              </div>
            </div>

            <div className="my-4 border-t border-dashed border-border sm:my-5" />

            <div className="grid grid-cols-2 gap-2 text-xs sm:gap-3">
              <Meta icon={Building2} label="Department" value={passData.department} />
              <Meta icon={MapPin} label="Office Floor" value={passData.floor} />
              <Meta icon={Calendar} label="Date" value={passDateLabel} />
              <Meta icon={Clock} label="Time" value={`${passData.slot} - ${slotEndHour}`} />
            </div>

            <div className="mt-3 rounded-xl border border-border/60 bg-card p-2.5 text-xs text-muted-foreground">
              Officer: <span className="font-medium text-foreground">{passData.officer}</span>
            </div>

            <div className="mt-4 flex justify-center sm:mt-6">
              <QRDisplay value="FP-2841-RAHUL-PATIL-PMRD" size={qrSize} />
            </div>

            <div className="mt-4 rounded-xl bg-secondary/60 p-3 text-center sm:mt-5 sm:rounded-2xl sm:p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Validity ends in
              </div>
              <div className="mt-1 font-mono text-xl font-bold tabular-nums text-primary sm:text-2xl">
                {hh}:{mm}:{ss}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold">Status</h2>
            <p className="text-xs text-muted-foreground">
              {isScanned
                ? "QR scanned at gate. Pass is approved for entry."
                : "Scan this QR at security desk. Approved status will appear after scan."}
            </p>
            {!isScanned && (
              <Button
                variant="outline"
                className="mt-3 h-10 w-full rounded-xl sm:w-auto"
                onClick={markScanned}
              >
                Simulate QR Scan
              </Button>
            )}
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold">Actions</h2>
            <p className="text-xs text-muted-foreground">
              Save your visitor pass or share it with the visitor.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                className="h-12 rounded-xl"
                disabled={!isScanned}
                onClick={() => toast.success("PDF downloaded")}
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-xl"
                disabled={!isScanned}
                onClick={() => toast.success("Share link copied")}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold">Visit instructions</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {[
                "Arrive 10 minutes before the scheduled slot.",
                "Carry the same ID proof submitted during registration.",
                "Show this QR code at the entrance kiosk.",
                "Pass is valid only for the assigned date and time.",
              ].map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Meta({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}
