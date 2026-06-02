import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Calendar,
  Check,
  Clock,
  Upload,
  type LucideIcon,
  User,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/appointment")({
  head: () => ({ meta: [{ title: "Book Appointment - PMRD" }] }),
  component: Appointment,
});

const steps = ["Visitor Info", "Department", "Schedule"];

const departments = [
  "Administration Department",
  "Project Management Department",
  "Finance & Accounts Department",
  "Monitoring & Evaluation Department",
  "IT & Digital Services Department",
  "Public Grievance & Support Department",
  "Document Management Department (DMS)",
  "Legal & Compliance Department",
  "Field Operations Department",
  "Visitor Management Department",
  "Procurement & Tender Department",
  "Human Resource (HR) Department",
];

const slots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

const officers = [
  { id: "officer-1", name: "Mr. Suresh Patil", designation: "Joint Secretary", floor: "2nd Floor" },
  {
    id: "officer-2",
    name: "Ms. Neha Kulkarni",
    designation: "Deputy Commissioner",
    floor: "3rd Floor",
  },
  { id: "officer-3", name: "Mr. Amit Jadhav", designation: "Section Officer", floor: "1st Floor" },
];

function Appointment() {
  const [step, setStep] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [slot, setSlot] = useState("10:00");
  const [date, setDate] = useState("2026-05-22");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoName, setPhotoName] = useState("");
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const selectedOfficer = useMemo(
    () => officers.find((officer) => officer.id === officerId),
    [officerId],
  );

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size should be less than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(String(reader.result || ""));
      setPhotoName(file.name);
    };
    reader.onerror = () => toast.error("Could not read selected photo.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const goNext = () => {
    if (step === 0 && !photoPreview) {
      toast.error("Please upload or capture visitor photo.");
      return;
    }

    if (step === 1) {
      if (!selectedDepartment) {
        toast.error("Please select department.");
        return;
      }
      if (!officerId) {
        toast.error("Please select an officer.");
        return;
      }
    }
    setStep((value) => value + 1);
  };

  const submitAppointment = () => {
    if (!selectedOfficer) {
      toast.error("Please select an officer.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "pmrd-pass-data",
        JSON.stringify({
          department: selectedDepartment,
          officer: `${selectedOfficer.name} (${selectedOfficer.designation})`,
          floor: selectedOfficer.floor,
          date,
          slot,
          photoUrl: photoPreview,
        }),
      );
      localStorage.removeItem("pmrd-pass-scanned");
    }

    toast.success("Appointment selected - visitor pass generated");
    setTimeout(() => navigate({ to: "/pass" }), 700);
  };

  return (
    <DashboardLayout
      title="Book an appointment"
      subtitle="Select department, choose officer, and generate visitor pass."
    >
      <div className="glass rounded-2xl p-6 md:p-8">
        <ol className="mb-8 flex items-center gap-2 overflow-x-auto md:gap-3">
          {steps.map((label, index) => {
            const active = step === index;
            const done = step > index;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition ${
                    done
                      ? "bg-success text-success-foreground"
                      : active
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={`hidden whitespace-nowrap text-xs font-medium md:inline ${active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-1 h-px flex-1 ${done ? "bg-success" : "bg-border"}`} />
                )}
              </li>
            );
          })}
        </ol>

        {step === 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={User} label="Full Name" placeholder="Rahul Patil" />
            <Field label="Mobile Number" placeholder="+91 98xxxxxxxx" />
            <Field label="Aadhaar Number" placeholder="XXXX-XXXX-1234" className="md:col-span-2" />
            <div className="space-y-2 md:col-span-2">
              <Label>Visitor Photo</Label>
              <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Visitor preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="px-2 text-center text-xs text-muted-foreground">
                        No photo selected
                      </span>
                    )}
                  </div>
                  <div className="w-full space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {photoName
                        ? `Selected: ${photoName}`
                        : "Upload or click a photo from camera (max 5 MB)."}
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl"
                        onClick={() => uploadInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <Camera className="mr-2 h-4 w-4" /> Click Camera
                      </Button>
                    </div>
                  </div>
                </div>
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Department</Label>
              <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Building2 className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                  <select
                    value={selectedDepartment}
                    onChange={(event) => {
                      setSelectedDepartment(event.target.value);
                      setOfficerId("");
                    }}
                    className="h-10 w-full bg-transparent text-sm font-medium outline-none"
                  >
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Please select the department before choosing officer.
                </p>
                {selectedDepartment && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Check className="h-3.5 w-3.5" /> {selectedDepartment}
                  </div>
                )}
              </div>
            </div>

            {selectedDepartment && (
              <div className="space-y-2">
                <Label>Officer</Label>
                <select
                  value={officerId}
                  onChange={(event) => setOfficerId(event.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition focus:border-primary md:w-1/2"
                >
                  <option value="">Select officer</option>
                  {officers.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} - {officer.designation}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedOfficer && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
                Officer office location:{" "}
                <span className="font-semibold text-foreground">{selectedOfficer.floor}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label>Purpose of Visit</Label>
              <Textarea
                placeholder="Briefly describe the purpose of your visit..."
                className="min-h-24 rounded-xl"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="rounded-xl pl-9"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Time slot
              </Label>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                {slots.map((timeSlot) => (
                  <button
                    type="button"
                    key={timeSlot}
                    onClick={() => setSlot(timeSlot)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      slot === timeSlot
                        ? "border-primary bg-primary text-primary-foreground shadow-glow"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {timeSlot}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground md:col-span-2">
              Department:{" "}
              <span className="font-semibold text-foreground">{selectedDepartment || "-"}</span>
              {selectedOfficer && (
                <>
                  {" | "}Officer:{" "}
                  <span className="font-semibold text-foreground">{selectedOfficer.name}</span>
                  {" | "}Floor:{" "}
                  <span className="font-semibold text-foreground">{selectedOfficer.floor}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            className="w-full sm:w-auto"
            disabled={step === 0}
            onClick={() => setStep((value) => value - 1)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button className="w-full rounded-xl sm:w-auto" onClick={goNext}>
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button className="w-full rounded-xl sm:w-auto" onClick={submitAppointment}>
              Generate pass <Check className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Field({
  label,
  placeholder,
  className = "",
  icon: Icon,
}: {
  label: string;
  placeholder: string;
  className?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
        <Input placeholder={placeholder} className={`rounded-xl ${Icon ? "pl-9" : ""}`} />
      </div>
    </div>
  );
}
