import { describe, expect, it } from "vitest";
import {
  inquireSchemaPackageA,
  inquireSchemaPackageB,
} from "./inquire-schema";

const validPackageA = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "",
  location: "Portland, OR",
  howHeard: "search-engine" as const,
  message:
    "We are looking for an ADRK-aligned Rottweiler as a family companion with training goals.",
  experience: "pet-owner" as const,
  household: "Two adults with a fenced yard.",
  goals: "family" as const,
  timeline: "flexible" as const,
  consent: true as const,
};

describe("inquireSchemaPackageA", () => {
  it("accepts a valid Package A inquiry payload", () => {
    const result = inquireSchemaPackageA.safeParse(validPackageA);
    expect(result.success).toBe(true);
  });

  it("rejects missing required name", () => {
    const result = inquireSchemaPackageA.safeParse({
      ...validPackageA,
      name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Please complete this field.");
    }
  });

  it("rejects invalid email", () => {
    const result = inquireSchemaPackageA.safeParse({
      ...validPackageA,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find(
        (issue) => issue.path[0] === "email",
      );
      expect(emailIssue?.message).toBe(
        "Please include a valid email so we can respond.",
      );
    }
  });

  it("rejects message shorter than 50 characters", () => {
    const result = inquireSchemaPackageA.safeParse({
      ...validPackageA,
      message: "Too short.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "message");
      expect(issue?.message).toBe(
        "A few more sentences help us understand your interest.",
      );
    }
  });

  it("requires consent checkbox", () => {
    const result = inquireSchemaPackageA.safeParse({
      ...validPackageA,
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional phone when omitted or empty", () => {
    expect(
      inquireSchemaPackageA.safeParse({ ...validPackageA, phone: "" }).success,
    ).toBe(true);
    expect(
      inquireSchemaPackageA.safeParse({
        ...validPackageA,
        phone: "503-555-0100",
      }).success,
    ).toBe(true);
  });
});

describe("inquireSchemaPackageB", () => {
  it("requires agreement acknowledgment for Package B", () => {
    const result = inquireSchemaPackageB.safeParse({
      ...validPackageA,
      agreementAcknowledgment: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid Package B payload with agreement", () => {
    const result = inquireSchemaPackageB.safeParse({
      ...validPackageA,
      preferredSex: "no-preference",
      naturalTailPreference: "Natural tail preferred",
      trainerReference: "Dr. Smith, DVM",
      agreementAcknowledgment: true,
    });
    expect(result.success).toBe(true);
  });
});
