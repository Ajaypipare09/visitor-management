import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PMRDLogo } from "@/components/PMRDLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ArrowLeft, ArrowRight, Check, KeyRound, Phone, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register - PMRD Visitor System" }] }),
  component: Register,
});

const steps = [
  { id: 1, label: "Identity", icon: ShieldCheck },
  { id: 2, label: "Personal", icon: User },
  { id: 3, label: "Verify", icon: Check },
];

const DUMMY_OTP = "123456";

function Register() {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("Rahul Patil");
  const [gender, setGender] = useState("Male");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Pune");
  const [stateName, setStateName] = useState("Maharashtra");
  const [pincode, setPincode] = useState("411001");
  const [district, setDistrict] = useState("Pune");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const aadhaarDigits = aadhaar.replace(/\D/g, "");

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{0,4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join("-"),
    );
  };

  const maskedAadhaar = aadhaarDigits
    ? `XXXX-XXXX-${aadhaarDigits.slice(-4).padStart(4, "X")}`
    : "XXXX-XXXX-XXXX";

  const goToNextStep = () => {
    if (step === 1) {
      if (aadhaarDigits.length !== 12) {
        toast.error("Enter a valid 12-digit Aadhaar number.");
        return;
      }
      if (mobile.length !== 10) {
        toast.error("Enter a valid 10-digit mobile number.");
        return;
      }
    }

    if (step === 2) {
      if (!fullName.trim()) {
        toast.error("Please enter full name.");
        return;
      }
      if (!addressLine.trim()) {
        toast.error("Please enter address line.");
        return;
      }
      if (!city.trim() || !district.trim() || !stateName.trim() || pincode.length < 6) {
        toast.error("Please complete full address details.");
        return;
      }
    }

    setStep((s) => s + 1);
  };

  const submitRegistration = () => {
    if (!otpSent) {
      toast.error("Send OTP first to continue.");
      return;
    }

    if (otp !== DUMMY_OTP) {
      toast.error(`Invalid OTP. Use demo OTP ${DUMMY_OTP}.`);
      return;
    }

    toast.success("Account created. Redirecting...");
    setTimeout(() => navigate({ to: "/appointment" }), 700);
  };

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-4 py-4 md:px-12 md:py-5">
        <PMRDLogo />
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Create your visitor account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete the steps below to register with PMRD.
        </p>

        <ol className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 md:gap-4">
          {steps.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li key={s.id} className="flex min-w-[108px] flex-1 items-center gap-2 md:min-w-0">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-semibold transition ${
                    done
                      ? "border-success bg-success text-success-foreground"
                      : active
                        ? "border-primary bg-primary text-primary-foreground shadow-glow"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span
                  className={`text-[11px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`mx-1 h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />
                )}
              </li>
            );
          })}
        </ol>

        <div className="glass mt-8 rounded-2xl p-6 md:p-8">
          {step === 1 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Aadhaar Number</Label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={formatAadhaar(aadhaar)}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX"
                    className="rounded-xl pl-9 tracking-widest"
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Mobile Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    +91
                  </span>
                  <Input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98xxxxxxxx"
                    className="rounded-xl pl-16"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full Name"
                placeholder="Rahul Patil"
                value={fullName}
                onChange={setFullName}
              />
              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="flex gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                        gender === g
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Address Line"
                placeholder="Plot 12, MG Road"
                className="md:col-span-2"
                value={addressLine}
                onChange={setAddressLine}
              />
              <Field label="City" placeholder="Pune" value={city} onChange={setCity} />
              <Field
                label="State"
                placeholder="Maharashtra"
                value={stateName}
                onChange={setStateName}
              />
              <Field label="Pincode" placeholder="411001" value={pincode} onChange={setPincode} />
              <Field label="District" placeholder="Pune" value={district} onChange={setDistrict} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-success/30 bg-success/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Almost there!</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Review your details and verify with mobile OTP before submitting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                {[
                  ["Name", fullName || "Rahul Patil"],
                  ["Aadhaar", maskedAadhaar],
                  ["Mobile", mobile ? `+91 ${mobile}` : "Not provided"],
                  ["Gender", gender],
                  ["City", city || "Pune"],
                  ["Pincode", pincode || "411001"],
                  ["District", district || "Pune"],
                  ["Address", addressLine || "Not provided"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border/60 bg-card p-3">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {k}
                    </div>
                    <div className="mt-0.5 font-medium">{v}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <Label>Mobile OTP Verification</Label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="rounded-xl pl-9"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl md:w-auto"
                    onClick={() => {
                      setOtpSent(true);
                      toast.success(`Dummy OTP sent to +91 ${mobile}. Use ${DUMMY_OTP}.`);
                    }}
                    disabled={mobile.length !== 10}
                  >
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Demo OTP: {DUMMY_OTP}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              className="w-full sm:w-auto"
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < steps.length ? (
              <Button className="w-full rounded-xl sm:w-auto" onClick={goToNextStep}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button className="w-full rounded-xl sm:w-auto" onClick={submitRegistration}>
                Submit registration <Check className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  className = "",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      {onChange ? (
        <Input
          placeholder={placeholder}
          className="rounded-xl"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input placeholder={placeholder} className="rounded-xl" defaultValue={value} />
      )}
    </div>
  );
}
