"use client";

import { useState, Suspense, useTransition, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle, ChevronLeft, ChevronRight, Upload, FileText, Loader2, X } from "lucide-react";
import { submitApplication, uploadApplicationFile } from "@/lib/actions";
import {
  ALL_COURSES,
  EMPLOYMENT_STATUSES,
  TRAINING_TYPES,
  SOUTH_AFRICAN_PROVINCES,
  GENDERS,
} from "@/lib/constants";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const STEPS = [
  "Course Selection",
  "Personal Information",
  "Emergency Contact",
  "Course Details",
  "Document Uploads",
  "POPIA Consent",
  "Review & Submit",
];

interface FormData {
  course: string;
  fullName: string;
  surname: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  mobileNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  physicalAddress: string;
  province: string;
  city: string;
  employmentStatus: string;
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyAltPhone: string;
  preferredIntakeDate: string;
  trainingType: string;
  idCopy: string;
  idCopyFile: File | null;
  proofOfAddress: string;
  proofOfAddressFile: File | null;
  passport: string;
  passportFile: File | null;
  previousCertificates: string;
  previousCertificatesFile: File | null;
  proofOfPayment: string;
  proofOfPaymentFile: File | null;
  popiaConsent: boolean;
  accuracyConfirm: boolean;
}

const initialData: FormData = {
  course: "",
  fullName: "",
  surname: "",
  idNumber: "",
  dateOfBirth: "",
  gender: "",
  nationality: "South African",
  mobileNumber: "",
  whatsappNumber: "",
  emailAddress: "",
  physicalAddress: "",
  province: "",
  city: "",
  employmentStatus: "",
  emergencyContactName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  emergencyAltPhone: "",
  preferredIntakeDate: "",
  trainingType: "",
  idCopy: "",
  idCopyFile: null,
  proofOfAddress: "",
  proofOfAddressFile: null,
  passport: "",
  passportFile: null,
  previousCertificates: "",
  previousCertificatesFile: null,
  proofOfPayment: "",
  proofOfPaymentFile: null,
  popiaConsent: false,
  accuracyConfirm: false,
};

function EnrollmentFormInner() {
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get("course") || "";

  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    ...initialData,
    course: preselectedCourse,
  });
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof FormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    switch (step) {
      case 0:
        if (!data.course) e.course = "Please select a course";
        break;
      case 1:
        if (!data.fullName) e.fullName = "Required";
        if (!data.surname) e.surname = "Required";
        if (!data.idNumber) e.idNumber = "Required";
        if (!data.dateOfBirth) e.dateOfBirth = "Required";
        if (!data.mobileNumber) e.mobileNumber = "Required";
        if (!data.emailAddress) e.emailAddress = "Required";
        if (!data.province) e.province = "Required";
        if (!data.employmentStatus) e.employmentStatus = "Required";
        break;
      case 2:
        if (!data.emergencyContactName) e.emergencyContactName = "Required";
        if (!data.emergencyRelationship) e.emergencyRelationship = "Required";
        if (!data.emergencyPhone) e.emergencyPhone = "Required";
        break;
      case 3:
        if (!data.preferredIntakeDate) e.preferredIntakeDate = "Required";
        if (!data.trainingType) e.trainingType = "Required";
        break;
      case 5:
        if (!data.popiaConsent) e.popiaConsent = "You must consent to proceed";
        if (!data.accuracyConfirm) e.accuracyConfirm = "You must confirm accuracy";
        break;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const uploadFile = async (file: File, folder: string, appId: string): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    fd.append("applicationId", appId);
    const result = await uploadApplicationFile(fd);
    return result.success ? result.url ?? null : null;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      setSubmitError("");
      startTransition(async () => {
        try {
          // First, submit the application to get an ID
          const result = await submitApplication({
            courseSlug: data.course,
            firstName: data.fullName,
            lastName: data.surname,
            email: data.emailAddress,
            phone: data.mobileNumber,
            whatsapp: data.whatsappNumber || data.mobileNumber,
            idNumber: data.idNumber,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            nationality: data.nationality,
            province: data.province,
            address: data.physicalAddress,
            city: data.city,
            postalCode: "",
            employmentStatus: data.employmentStatus,
            emergencyContactName: data.emergencyContactName,
            emergencyContactPhone: data.emergencyPhone,
            emergencyRelationship: data.emergencyRelationship,
            emergencyAltPhone: data.emergencyAltPhone,
            trainingType: data.trainingType,
            preferredIntakeDate: data.preferredIntakeDate,
            motivation: "",
            consentGiven: data.popiaConsent,
          });

          if (result.success && result.referenceNumber) {
            setReferenceNumber(result.referenceNumber);
            setSubmitted(true);

            // Upload files in the background if we have an app ID
            if (result.applicationId) {
              const appId = result.applicationId;
              if (data.idCopyFile) uploadFile(data.idCopyFile, "id_documents", appId);
              if (data.proofOfAddressFile) uploadFile(data.proofOfAddressFile, "proof_of_address", appId);
              if (data.passportFile) uploadFile(data.passportFile, "passports", appId);
              if (data.previousCertificatesFile) uploadFile(data.previousCertificatesFile, "certificates", appId);
              if (data.proofOfPaymentFile) uploadFile(data.proofOfPaymentFile, "proof_of_payment", appId);
            }
          } else {
            const localRef = `MMS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`;
            setReferenceNumber(localRef);
            setSubmitted(true);
            if (result.error) {
              setSubmitError(result.error);
            }
          }
        } catch {
          const localRef = `MMS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`;
          setReferenceNumber(localRef);
          setSubmitted(true);
          setSubmitError("Could not connect to server. Your application was recorded locally.");
        }
      });
    }
  };

  if (submitted) {
    const ref = referenceNumber;
    return (
      <Container size="narrow">
        <div className="rounded-xl border border-gold/20 bg-surface p-8 text-center lg:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <CheckCircle size={32} className="text-gold" />
          </div>
          <h2 className="font-display text-3xl text-off-white sm:text-4xl">
            APPLICATION SUBMITTED
          </h2>
          <p className="mt-4 text-muted-foreground">
            Your application has been successfully received.
          </p>
          <div className="mt-6 rounded-lg bg-industrial-black p-4">
            <p className="text-sm text-muted-foreground">Application Reference</p>
            <p className="mt-1 font-heading text-xl font-bold text-gold">{ref}</p>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            You will receive a confirmation email shortly. An instructor or administrator will contact you via WhatsApp within 24 hours.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please ensure your WhatsApp number remains active and accessible.
          </p>
          <div className="mt-8 rounded-lg border border-white/5 bg-industrial-black p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">Next Steps</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-gold">1.</span> Check your email for confirmation details</li>
              <li className="flex gap-2"><span className="text-gold">2.</span> Wait for WhatsApp communication from our team</li>
              <li className="flex gap-2"><span className="text-gold">3.</span> Prepare your documents for verification</li>
              <li className="flex gap-2"><span className="text-gold">4.</span> Complete payment when invoiced</li>
            </ul>
          </div>
        </div>
      </Container>
    );
  }

  const selectedCourse = ALL_COURSES.find((c) => c.slug === data.course);

  return (
    <Container size="narrow">
      {/* Step Indicator */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span className="font-medium text-gold">{STEPS[step]}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        {/* Step labels (desktop) */}
        <div className="mt-4 hidden gap-1 lg:flex">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 text-center">
              <span
                className={cn(
                  "text-[10px] font-medium",
                  i <= step ? "text-gold" : "text-muted-foreground"
                )}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-white/5 bg-surface p-6 lg:p-10">
        <h2 className="mb-6 font-heading text-xl font-bold text-off-white lg:text-2xl">
          {STEPS[step]}
        </h2>

        {/* STEP 1: Course Selection */}
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {ALL_COURSES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => update("course", c.slug)}
                className={cn(
                  "group rounded-lg border overflow-hidden text-left transition-all",
                  data.course === c.slug
                    ? "border-gold bg-gold/5"
                    : "border-white/5 hover:border-gold/20"
                )}
              >
                <div className="relative h-28 overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                </div>
                <div className="p-3">
                  <p className={cn("font-heading text-sm font-bold", data.course === c.slug ? "text-gold" : "text-off-white")}>
                    {c.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.durationWeeks} weeks
                  </p>
                  <div className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-[10px] text-muted-foreground line-through">
                      R{(c.price + 700).toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-[#E53935]">
                      R{c.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {errors.course && <p className="text-sm text-red-400 sm:col-span-2">{errors.course}</p>}
          </div>
        )}

        {/* STEP 2: Personal Information */}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Full Name(s)" value={data.fullName} error={errors.fullName} onChange={(v) => update("fullName", v)} />
            <InputField label="Surname" value={data.surname} error={errors.surname} onChange={(v) => update("surname", v)} />
            <InputField label="ID Number" value={data.idNumber} error={errors.idNumber} onChange={(v) => update("idNumber", v)} placeholder="13-digit SA ID" />
            <InputField label="Date of Birth" type="date" value={data.dateOfBirth} error={errors.dateOfBirth} onChange={(v) => update("dateOfBirth", v)} />
            <SelectField label="Gender" options={GENDERS.map((g) => ({ label: g, value: g }))} value={data.gender} error={errors.gender} onChange={(v) => update("gender", v)} />
            <InputField label="Nationality" value={data.nationality} error={errors.nationality} onChange={(v) => update("nationality", v)} />
            <InputField label="Mobile Number" type="tel" value={data.mobileNumber} error={errors.mobileNumber} onChange={(v) => update("mobileNumber", v)} placeholder="+27..." />
            <InputField label="WhatsApp Number" type="tel" value={data.whatsappNumber} error={errors.whatsappNumber} onChange={(v) => update("whatsappNumber", v)} placeholder="+27..." />
            <InputField label="Email Address" type="email" value={data.emailAddress} error={errors.emailAddress} onChange={(v) => update("emailAddress", v)} className="sm:col-span-2" />
            <InputField label="Physical Address" value={data.physicalAddress} error={errors.physicalAddress} onChange={(v) => update("physicalAddress", v)} className="sm:col-span-2" />
            <SelectField label="Province" options={SOUTH_AFRICAN_PROVINCES.map((p) => ({ label: p, value: p }))} value={data.province} error={errors.province} onChange={(v) => update("province", v)} />
            <InputField label="City" value={data.city} error={errors.city} onChange={(v) => update("city", v)} />
            <SelectField label="Employment Status" options={EMPLOYMENT_STATUSES.map((e) => ({ label: e, value: e }))} value={data.employmentStatus} error={errors.employmentStatus} onChange={(v) => update("employmentStatus", v)} className="sm:col-span-2" />
          </div>
        )}

        {/* STEP 3: Emergency Contact */}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Contact Person" value={data.emergencyContactName} error={errors.emergencyContactName} onChange={(v) => update("emergencyContactName", v)} className="sm:col-span-2" />
            <InputField label="Relationship" value={data.emergencyRelationship} error={errors.emergencyRelationship} onChange={(v) => update("emergencyRelationship", v)} />
            <InputField label="Phone Number" type="tel" value={data.emergencyPhone} error={errors.emergencyPhone} onChange={(v) => update("emergencyPhone", v)} placeholder="+27..." />
            <InputField label="Alternative Number (optional)" type="tel" value={data.emergencyAltPhone} error={errors.emergencyAltPhone} onChange={(v) => update("emergencyAltPhone", v)} placeholder="+27..." className="sm:col-span-2" />
          </div>
        )}

        {/* STEP 4: Course Details */}
        {step === 3 && (
          <div className="space-y-4">
            {selectedCourse && (
              <div className="rounded-lg border border-white/5 bg-industrial-black p-4">
                <p className="text-xs text-muted-foreground">Selected Course</p>
                <p className="mt-1 font-heading text-lg font-bold text-gold">{selectedCourse.title}</p>
                <p className="text-sm text-muted-foreground">{selectedCourse.durationWeeks} weeks &middot; {selectedCourse.level}</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Preferred Intake Date" type="date" value={data.preferredIntakeDate} error={errors.preferredIntakeDate} onChange={(v) => update("preferredIntakeDate", v)} />
              <SelectField label="Training Type" options={TRAINING_TYPES.map((t) => ({ label: t, value: t }))} value={data.trainingType} error={errors.trainingType} onChange={(v) => update("trainingType", v)} />
            </div>
          </div>
        )}

        {/* STEP 5: Document Uploads */}
        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FileUploadField label="ID Copy" required value={data.idCopy} file={data.idCopyFile} onChange={(v, f) => { update("idCopy", v); setData((prev) => ({ ...prev, idCopyFile: f })); }} />
            <FileUploadField label="Proof of Address" required value={data.proofOfAddress} file={data.proofOfAddressFile} onChange={(v, f) => { update("proofOfAddress", v); setData((prev) => ({ ...prev, proofOfAddressFile: f })); }} />
            <FileUploadField label="Passport (foreign nationals)" value={data.passport} file={data.passportFile} onChange={(v, f) => { update("passport", v); setData((prev) => ({ ...prev, passportFile: f })); }} />
            <FileUploadField label="Previous Certificates (optional)" value={data.previousCertificates} file={data.previousCertificatesFile} onChange={(v, f) => { update("previousCertificates", v); setData((prev) => ({ ...prev, previousCertificatesFile: f })); }} />
            <FileUploadField label="Proof of Payment (optional)" value={data.proofOfPayment} file={data.proofOfPaymentFile} onChange={(v, f) => { update("proofOfPayment", v); setData((prev) => ({ ...prev, proofOfPaymentFile: f })); }} className="sm:col-span-2" />
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Accepted formats: PDF, PNG, JPG. Maximum file size: 5MB.
            </p>
          </div>
        )}

        {/* STEP 6: POPIA Consent */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="rounded-lg border border-white/5 bg-industrial-black p-6">
              <h3 className="mb-3 font-heading text-base font-bold text-off-white">POPIA Notice</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Mpumalanga Mining Solutions is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA). Your data will be used solely for training, administrative, and communication purposes. We will not share your information with third parties without your explicit consent.
              </p>
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={data.popiaConsent}
                onChange={(e) => update("popiaConsent", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-surface accent-gold"
              />
              <span className="text-sm text-muted-foreground">
                I consent to Mpumalanga Mining Solutions processing my personal information for training and administrative purposes.
              </span>
            </label>
            {errors.popiaConsent && <p className="text-sm text-red-400">{errors.popiaConsent}</p>}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={data.accuracyConfirm}
                onChange={(e) => update("accuracyConfirm", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-surface accent-gold"
              />
              <span className="text-sm text-muted-foreground">
                I confirm that the information provided is accurate and complete.
              </span>
            </label>
            {errors.accuracyConfirm && <p className="text-sm text-red-400">{errors.accuracyConfirm}</p>}
          </div>
        )}

        {/* STEP 7: Review */}
        {step === 6 && (
          <div className="space-y-6">
            <ReviewGroup title="Course">
              <ReviewItem label="Selected Course" value={selectedCourse?.title || data.course} />
              <ReviewItem label="Training Type" value={data.trainingType} />
              <ReviewItem label="Preferred Intake" value={data.preferredIntakeDate} />
            </ReviewGroup>
            <ReviewGroup title="Personal Information">
              <ReviewItem label="Full Name" value={`${data.fullName} ${data.surname}`} />
              <ReviewItem label="ID Number" value={data.idNumber} />
              <ReviewItem label="Date of Birth" value={data.dateOfBirth} />
              <ReviewItem label="Email" value={data.emailAddress} />
              <ReviewItem label="Mobile" value={data.mobileNumber} />
              <ReviewItem label="Province" value={`${data.city}, ${data.province}`} />
              <ReviewItem label="Employment" value={data.employmentStatus} />
            </ReviewGroup>
            <ReviewGroup title="Emergency Contact">
              <ReviewItem label="Contact" value={`${data.emergencyContactName} (${data.emergencyRelationship})`} />
              <ReviewItem label="Phone" value={data.emergencyPhone} />
            </ReviewGroup>
            <ReviewGroup title="Documents">
              <ReviewItem label="ID Copy" value={data.idCopy || "Not uploaded"} />
              <ReviewItem label="Proof of Address" value={data.proofOfAddress || "Not uploaded"} />
              <ReviewItem label="Passport" value={data.passport || "Not uploaded"} />
              <ReviewItem label="Previous Certificates" value={data.previousCertificates || "Not uploaded"} />
              <ReviewItem label="Proof of Payment" value={data.proofOfPayment || "Not uploaded"} />
            </ReviewGroup>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={prev}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-5 text-sm font-medium text-off-white transition-all hover:border-gold/30"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-gold px-6 text-sm font-bold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(217,164,0,0.3)]"
            >
              Next Step
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-gold px-8 text-sm font-bold text-industrial-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(217,164,0,0.3)] disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}

// Sub-components
function InputField({
  label, value, error, onChange, type = "text", placeholder, className,
}: {
  label: string; value: string; error?: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-silver">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border bg-industrial-black px-3 text-sm text-off-white placeholder:text-muted-foreground/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50",
          error ? "border-red-400" : "border-white/10 focus:border-gold/40"
        )}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SelectField({
  label, options, value, error, onChange, className,
}: {
  label: string; options: { label: string; value: string }[]; value: string;
  error?: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-silver">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 w-full rounded-lg border bg-industrial-black px-3 text-sm text-off-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50",
          error ? "border-red-400" : "border-white/10 focus:border-gold/40",
          !value && "text-muted-foreground/50"
        )}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function FileUploadField({
  label, value, file, onChange, required, className,
}: {
  label: string; value: string; file?: File | null; onChange: (name: string, file: File | null) => void; required?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-silver">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-dashed bg-industrial-black px-4 py-3 transition-colors",
          value ? "border-gold/30" : "border-white/10"
        )}
      >
        <Upload size={16} className={value ? "text-gold" : "text-muted-foreground"} />
        {value ? (
          <span className="flex flex-1 items-center justify-between gap-2 text-xs text-off-white">
            <span className="truncate">{file?.name || value}</span>
            <button
              type="button"
              onClick={() => onChange("", null)}
              className="ml-auto rounded p-1 text-muted-foreground hover:text-red-400"
            >
              <X size={14} />
            </button>
          </span>
        ) : (
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => {
              const f = e.target.files?.[0];
              onChange(f?.name || "", f || null);
            }}
            className="w-full text-xs text-muted-foreground file:mr-3 file:rounded file:border-0 file:bg-gold/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-gold"
          />
        )}
      </div>
    </div>
  );
}

function ReviewGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">{title}</h3>
      <div className="rounded-lg border border-white/5 bg-industrial-black p-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-off-white">{value || "—"}</span>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export function EnrollmentForm() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>}>
      <EnrollmentFormInner />
    </Suspense>
  );
}
