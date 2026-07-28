"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { InquiryConfirmation } from "@/components/inquire/InquiryConfirmation";
import {
  buildInquireStartPayload,
  buildInquireSubmitPayload,
} from "@/lib/analytics/inquire-events";
import { track } from "@/lib/analytics/track";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_EMAIL } from "@/lib/constants";
import type { InquirePackage } from "@/lib/site-config";
import { PACKAGE_COPY } from "@/lib/site-config";
import {
  EXPERIENCE_OPTIONS,
  GOALS_OPTIONS,
  HOW_HEARD_OPTIONS,
  INQUIRE_ERROR_COPY,
  PREFERRED_SEX_OPTIONS,
  TIMELINE_OPTIONS,
  inquireSchemaPackageA,
  inquireSchemaPackageB,
  type InquireFormValuesA,
  type InquireFormValuesB,
} from "@/lib/validations/inquire-schema";

type InquiryFormProps = {
  packageMode: InquirePackage;
};

function buildMailtoBody(
  values: InquireFormValuesA | InquireFormValuesB,
  packageMode: InquirePackage,
): string {
  const heardLabel =
    HOW_HEARD_OPTIONS.find((o) => o.value === values.howHeard)?.label ??
    values.howHeard;
  const experienceLabel =
    EXPERIENCE_OPTIONS.find((o) => o.value === values.experience)?.label ??
    values.experience;
  const goalsLabel =
    GOALS_OPTIONS.find((o) => o.value === values.goals)?.label ?? values.goals;
  const timelineLabel =
    TIMELINE_OPTIONS.find((o) => o.value === values.timeline)?.label ??
    values.timeline;

  const lines = [
    `Package mode: ${packageMode}`,
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    values.phone ? `Phone: ${values.phone}` : null,
    `Location: ${values.location}`,
    "",
    "Why Blacksage?",
    values.message,
    "",
    `Prior Rottweiler experience: ${experienceLabel}`,
    values.household ? `Household context: ${values.household}` : null,
    `Activity level / goals: ${goalsLabel}`,
    `Timeline: ${timelineLabel}`,
    "",
    `How they heard about us: ${heardLabel}`,
  ];

  if (packageMode === "B" && "preferredSex" in values) {
    if (values.preferredSex) {
      lines.push(`Preferred sex: ${values.preferredSex}`);
    }
    if (values.naturalTailPreference) {
      lines.push(`Natural tail preference: ${values.naturalTailPreference}`);
    }
    if (values.trainerReference) {
      lines.push(`Trainer or vet reference: ${values.trainerReference}`);
    }
  }

  return lines.filter(Boolean).join("\n");
}

export function InquiryForm({ packageMode }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const hasTrackedStart = useRef(false);
  const copy = PACKAGE_COPY[packageMode];
  const schema =
    packageMode === "B" ? inquireSchemaPackageB : inquireSchemaPackageA;

  const form = useForm<InquireFormValuesA | InquireFormValuesB>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      howHeard: undefined,
      message: "",
      experience: undefined,
      household: "",
      goals: undefined,
      timeline: undefined,
      consent: false,
      ...(packageMode === "B"
        ? {
            preferredSex: undefined,
            naturalTailPreference: "",
            trainerReference: "",
            agreementAcknowledgment: false,
          }
        : {}),
    },
    mode: "onBlur",
  });

  function trackInquireStartOnce() {
    if (hasTrackedStart.current) {
      return;
    }

    hasTrackedStart.current = true;
    track("inquire_start", buildInquireStartPayload(packageMode));
  }

  async function onSubmit(values: InquireFormValuesA | InquireFormValuesB) {
    setSubmitError(null);
    setPending(true);

    try {
      track("inquire_submit", buildInquireSubmitPayload({ packageMode, values }));

      const subject = encodeURIComponent(
        `Blacksage Kennels inquiry — ${values.name}`,
      );
      const body = encodeURIComponent(buildMailtoBody(values, packageMode));
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

      window.location.href = mailto;
      setSubmitted(true);
    } catch {
      track("inquire_submit_fail", {
        package_mode: packageMode,
        failure_reason: "mailto_blocked",
        prior_evidence_count: buildInquireStartPayload(packageMode)
          .prior_evidence_count,
      });
      setSubmitError(INQUIRE_ERROR_COPY.submitFailure);
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return <InquiryConfirmation packageMode={packageMode} />;
  }

  return (
    <div className="space-y-8">
      <div className="prose-body space-y-3">
        <p>{copy.expectation}</p>
        {"depositAddendum" in copy && copy.depositAddendum ? (
          <p>{copy.depositAddendum}</p>
        ) : null}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onFocusCapture={trackInquireStartOnce}
          onChangeCapture={trackInquireStartOnce}
          className="space-y-6 rounded-sm border border-blacksage-border bg-blacksage-lifted p-6 md:p-8"
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormDescription>
                  We&apos;ll respond to this address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" autoComplete="tel" {...field} />
                </FormControl>
                <FormDescription>
                  Optional — for follow-up if you prefer a call.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City and state or region</FormLabel>
                <FormControl>
                  <Input autoComplete="address-level2" {...field} />
                </FormControl>
                <FormDescription>
                  Helps us discuss placement logistics.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="howHeard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {HOW_HEARD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why Blacksage?</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormDescription>
                  What draws you to our program? Include any questions. (50+
                  characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prior Rottweiler experience</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="household"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Household context (optional)</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormDescription>
                  Who lives in the home, daily routine, yard or space, other
                  pets.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity level / goals</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GOALS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {packageMode === "B" ? (
            <>
              <FormField
                control={form.control}
                name="preferredSex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred sex (optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PREFERRED_SEX_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="naturalTailPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Natural tail preference (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      When operator policy confirmed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trainerReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer or vet reference (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional credibility signal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreementAcknowledgment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value === true}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal">
                        I understand a waitlist deposit may be required after
                        approval; terms provided individually.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </>
          ) : null}

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    I understand this inquiry is not a reservation; placements
                    are selective.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {submitError ? (
            <p className="text-sm text-destructive">{submitError}</p>
          ) : null}

          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Sending…" : "Submit inquiry"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
