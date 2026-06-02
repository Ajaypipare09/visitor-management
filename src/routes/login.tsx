import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PMRDLogo } from "@/components/PMRDLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ArrowLeft, KeyRound, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login - PMRD Visitor System" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const maskAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(\d{4})?(\d{4})?/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join("-"),
    );
  };

  const masked = aadhaar
    ? aadhaar.replace(/^(\d{4})-?(\d{4})?-?(\d{0,4})$/, (_, a, b, c) => `XXXX-XXXX-${c || b || ""}`)
    : "";

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-hero-gradient p-10 text-white md:flex">
        <PMRDLogo variant="light" />
        <div>
          <h2 className="text-balance text-4xl font-bold leading-tight">
            Welcome to the digital gateway of PMRD offices.
          </h2>
          <p className="mt-4 text-white/70">
            Login securely with Aadhaar-OTP to manage your visits, passes and appointments.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs text-white/60">
          <div>
            <div className="text-2xl font-bold text-white">256-bit</div>
            encryption
          </div>
          <div>
            <div className="text-2xl font-bold text-white">UIDAI</div>
            verified
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24x7</div>
            support
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <LanguageToggle />
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8 md:hidden">
              <PMRDLogo />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 1
                ? "Enter your Aadhaar and mobile to receive an OTP."
                : "Enter the 6-digit OTP sent to your registered mobile."}
            </p>

            <div className="glass mt-6 space-y-5 rounded-2xl p-6">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label>Aadhaar Number</Label>
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={maskAadhaar(aadhaar)}
                        onChange={(event) => setAadhaar(event.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className="pl-9 tracking-widest"
                        maxLength={14}
                      />
                    </div>
                    {masked && (
                      <p className="text-xs text-muted-foreground">
                        Will be stored as <span className="font-mono">{masked}</span>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        +91
                      </span>
                      <Input
                        value={mobile}
                        onChange={(event) =>
                          setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="98xxxxxxxx"
                        className="pl-16"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full rounded-xl"
                    disabled={aadhaar.replace(/\D/g, "").length !== 12 || mobile.length !== 10}
                    onClick={() => {
                      toast.success("OTP sent to +91 " + mobile);
                      setStep(2);
                    }}
                  >
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Enter OTP</Label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={otp}
                        onChange={(event) =>
                          setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="......"
                        className="pl-9 text-center text-xl tracking-[0.6em]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Demo OTP: any 6 digits</p>
                  </div>
                  <Button
                    className="w-full rounded-xl"
                    disabled={otp.length !== 6}
                    onClick={() => {
                      toast.success("Welcome back, Rahul");
                      navigate({ to: "/appointment" });
                    }}
                  >
                    Verify & Continue
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                  >
                    Change number
                  </button>
                </>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
