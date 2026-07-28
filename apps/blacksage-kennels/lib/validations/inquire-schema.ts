import { z } from "zod";

export const HOW_HEARD_OPTIONS = [
  { value: "referral", label: "Referral from a Blacksage owner or contact" },
  { value: "search-engine", label: "Search engine" },
  { value: "social-media", label: "Social media" },
  { value: "breed-club", label: "ADRK / breed club or event" },
  { value: "other", label: "Other" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "pet-owner", label: "Pet owner" },
  { value: "working-sport", label: "Working-sport" },
  { value: "breeder-experienced", label: "Breeder-experienced" },
] as const;

export const GOALS_OPTIONS = [
  { value: "companion", label: "Companion" },
  { value: "family", label: "Family" },
  { value: "sport-working", label: "Sport-working" },
  { value: "show-structure", label: "Show-structure" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "0-6", label: "0–6 mo" },
  { value: "6-12", label: "6–12 mo" },
  { value: "12-plus", label: "12+ mo" },
  { value: "flexible", label: "Flexible" },
] as const;

export const PREFERRED_SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "no-preference", label: "No preference" },
] as const;

const requiredMessage = "Please complete this field.";
const emailMessage = "Please include a valid email so we can respond.";
const textareaMessage =
  "A few more sentences help us understand your interest.";

const sharedFields = {
  name: z.string().trim().min(1, requiredMessage),
  email: z.string().trim().email(emailMessage),
  phone: z.string().optional(),
  location: z.string().trim().min(1, requiredMessage),
  howHeard: z.enum(
    ["referral", "search-engine", "social-media", "breed-club", "other"],
    { message: requiredMessage },
  ),
  message: z.string().trim().min(50, textareaMessage),
  experience: z.enum(
    ["none", "pet-owner", "working-sport", "breeder-experienced"],
    { message: requiredMessage },
  ),
  household: z.string().optional(),
  goals: z.enum(["companion", "family", "sport-working", "show-structure"], {
    message: requiredMessage,
  }),
  timeline: z.enum(["0-6", "6-12", "12-plus", "flexible"], {
    message: requiredMessage,
  }),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: requiredMessage }),
};

export const inquireSchemaPackageA = z.object(sharedFields);

export const inquireSchemaPackageB = z.object({
  ...sharedFields,
  preferredSex: z
    .enum(["male", "female", "no-preference"])
    .optional()
    .or(z.literal("")),
  naturalTailPreference: z.string().optional(),
  trainerReference: z.string().optional(),
  agreementAcknowledgment: z
    .boolean()
    .refine((val) => val === true, { message: requiredMessage }),
});

export type InquireFormValuesA = z.infer<typeof inquireSchemaPackageA>;
export type InquireFormValuesB = z.infer<typeof inquireSchemaPackageB>;
export type InquireFormValues = InquireFormValuesA | InquireFormValuesB;

export const INQUIRE_ERROR_COPY = {
  required: requiredMessage,
  email: emailMessage,
  textarea: textareaMessage,
  submitFailure:
    "Something went wrong. Please try again or contact us directly at [CONTACT].",
} as const;
