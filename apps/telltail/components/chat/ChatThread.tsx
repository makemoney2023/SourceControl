"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { DisclosureBanner } from "@/components/chat/DisclosureBanner";
import { MomentCard } from "@/components/chat/MomentCard";
import { PaywallStub } from "@/components/chat/PaywallStub";
import { RefuseCard } from "@/components/chat/RefuseCard";
import { Button } from "@/components/ui/button";
import {
  canStartRead,
  consumeRead,
  loadQuota,
  saveQuota,
} from "@/lib/quota/lite-quota";
import type {
  LiteQuota,
  MediaAttachment,
  RefuseReason,
  ThreadMessage,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CONTEXT_CHIPS = [
  "Kids nearby",
  "Food / guarding",
  "Doorbell",
  "Visitor",
] as const;

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function ChatThread() {
  const [messages, setMessages] = useState<ThreadMessage[]>([
    {
      id: "welcome",
      role: "system",
      kind: "text",
      text: "Tell the scare — what happened, who was there, what the dog did. Attach a clip or still when you're ready for a read. Text alone never claims we saw your dog.",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quota, setQuota] = useState<LiteQuota>(() => loadQuota());
  const [isReading, setIsReading] = useState(false);
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveQuota(quota);
  }, [quota]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isReading]);

  const recentContext = messages
    .filter((m) => m.kind === "text" && m.role === "user")
    .slice(-3)
    .map((m) => (m.kind === "text" ? m.text : ""))
    .join("\n");

  const appendMessage = useCallback((message: ThreadMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSendText = () => {
    const text = input.trim();
    if (!text) return;
    appendMessage({
      id: uid(),
      role: "user",
      kind: "text",
      text,
      createdAt: Date.now(),
    });
    setInput("");
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setPendingFile(file);
    const url = await readFileAsDataUrl(file);
    setPreviewUrl(url);
  };

  const clearAttachment = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runVisionRead = async (attachment: MediaAttachment, contextText: string) => {
    if (!canStartRead(quota)) {
      appendMessage({
        id: uid(),
        role: "assistant",
        kind: "refuse",
        title: "Lite reads used",
        body: "",
        reason: "quota-exhausted",
        escalate:
          "Explore Lite includes a few reads. Plus is stubbed — no payment path in this build.",
        createdAt: Date.now(),
      });
      appendMessage({
        id: uid(),
        role: "assistant",
        kind: "paywall-stub",
        createdAt: Date.now(),
      });
      return;
    }

    setIsReading(true);
    try {
      const response = await fetch("/api/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: attachment.dataUrl,
          contextText,
          chips: selectedChips,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        result?: {
          refuse: boolean;
          refuse_reason: RefuseReason | null;
          signals: string[];
          confidence: "low" | "medium" | "high";
          confidence_note: string;
          actions: string[];
          stop_rule: string;
          escalate: string;
        };
      };

      if (!response.ok || !payload.result) {
        appendMessage({
          id: uid(),
          role: "assistant",
          kind: "refuse",
          title: "Read unavailable",
          body: "",
          reason: "api-unavailable",
          escalate: payload.error ?? "Try again when the vision service is configured.",
          createdAt: Date.now(),
        });
        return;
      }

      setQuota((current) => consumeRead(current));

      const result = payload.result;
      if (result.refuse) {
        appendMessage({
          id: uid(),
          role: "assistant",
          kind: "refuse",
          title: "We will not coach this clip.",
          body: "",
          reason: result.refuse_reason ?? "confidence-floor",
          escalate: result.escalate,
          createdAt: Date.now(),
        });
      } else {
        appendMessage({
          id: uid(),
          role: "assistant",
          kind: "moment",
          signals: result.signals,
          confidence: result.confidence,
          confidence_note: result.confidence_note,
          actions: result.actions,
          stop_rule: result.stop_rule,
          createdAt: Date.now(),
        });
      }
    } finally {
      setIsReading(false);
    }
  };

  const handleSubmitRead = async () => {
    if (!pendingFile || !previewUrl) return;

    if (!disclosureAccepted) {
      return;
    }

    const attachment: MediaAttachment = {
      name: pendingFile.name,
      mimeType: pendingFile.type || "image/jpeg",
      dataUrl: previewUrl,
    };

    appendMessage({
      id: uid(),
      role: "user",
      kind: "media",
      text: input.trim() || undefined,
      attachment,
      createdAt: Date.now(),
    });

    const contextText = [recentContext, input.trim()].filter(Boolean).join("\n");
    setInput("");
    clearAttachment();

    await runVisionRead(attachment, contextText);
  };

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col bg-[var(--color-field)]">
      <header className="flex items-center justify-between border-b border-[var(--color-hairline)] bg-[var(--color-paper)] px-4 py-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)]">
            Telltail
          </p>
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
            Lite · {quota.remaining} reads left
          </p>
        </div>
      </header>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <DisclosureBanner />
        {messages.map((message) => {
          if (message.kind === "text") {
            const isUser = message.role === "user";
            const isSystem = message.role === "system";
            return (
              <div
                key={message.id}
                className={cn(
                  "max-w-[90%] rounded-2xl px-4 py-3 text-base",
                  isUser && "ml-auto bg-[var(--color-sign)] text-[var(--color-paper)]",
                  isSystem && "bg-[var(--color-paper)] text-[var(--color-muted)]",
                  !isUser && !isSystem && "bg-[var(--color-paper)] text-[var(--color-ink)]"
                )}
              >
                {message.text}
              </div>
            );
          }

          if (message.kind === "media") {
            return (
              <div key={message.id} className="ml-auto max-w-[90%] space-y-2">
                {message.text ? (
                  <p className="rounded-2xl bg-[var(--color-sign)] px-4 py-3 text-[var(--color-paper)]">
                    {message.text}
                  </p>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Attached media: ${message.attachment.name}`}
                  className="max-h-64 rounded-[var(--card-radius)] border border-[var(--color-hairline)] object-cover"
                  src={message.attachment.dataUrl}
                />
              </div>
            );
          }

          if (message.kind === "refuse") {
            return (
              <div key={message.id} className="max-w-[95%]">
                <RefuseCard
                  escalate={message.escalate}
                  reason={message.reason}
                  title={message.title}
                />
              </div>
            );
          }

          if (message.kind === "moment") {
            return (
              <div key={message.id} className="max-w-[95%]">
                <MomentCard
                  actions={message.actions}
                  confidence={message.confidence}
                  confidenceNote={message.confidence_note}
                  signals={message.signals}
                  stopRule={message.stop_rule}
                />
              </div>
            );
          }

          if (message.kind === "paywall-stub") {
            return (
              <div key={message.id} className="max-w-[95%]">
                <PaywallStub quota={quota} />
              </div>
            );
          }

          return null;
        })}
        {isReading ? (
          <p className="text-sm text-[var(--color-muted)]" aria-live="polite">
            Running one cloud vision read…
          </p>
        ) : null}
      </div>

      <div className="border-t border-[var(--color-hairline)] bg-[var(--color-paper)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex flex-wrap gap-2">
          {CONTEXT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              aria-pressed={selectedChips.includes(chip)}
              onClick={() => toggleChip(chip)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                selectedChips.includes(chip)
                  ? "border-[var(--color-sign)] bg-[var(--color-field)] text-[var(--color-ink)]"
                  : "border-[var(--color-hairline)] text-[var(--color-muted)]"
              )}
            >
              {chip}
            </button>
          ))}
        </div>

        {previewUrl ? (
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-[var(--color-hairline)] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Attachment preview"
              className="h-16 w-16 rounded object-cover"
              src={previewUrl}
            />
            <div className="flex-1 text-sm text-[var(--color-ink)]">{pendingFile?.name}</div>
            <Button type="button" variant="ghost" size="sm" onClick={clearAttachment}>
              Remove
            </Button>
          </div>
        ) : null}

        <label className="mb-3 flex items-start gap-2 text-sm text-[var(--color-ink)]">
          <input
            checked={disclosureAccepted}
            className="mt-1"
            type="checkbox"
            onChange={(e) => setDisclosureAccepted(e.target.checked)}
          />
          <span>I understand this clip leaves my device for one cloud vision read.</span>
        </label>

        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="chat-input">
            Describe what happened
          </label>
          <textarea
            id="chat-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="He froze at the door when the bell rang…"
            className="min-h-[3rem] flex-1 resize-none rounded-lg border border-[var(--color-hairline)] bg-[var(--color-field)] px-3 py-2 text-base text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sign)]"
          />
          <input
            ref={fileInputRef}
            accept="image/*,video/*"
            className="sr-only"
            id="attach-media"
            type="file"
            onChange={(e) => void handleFileChange(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Attach clip or still"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          {pendingFile ? (
            <Button
              type="button"
              disabled={!disclosureAccepted || isReading}
              onClick={() => void handleSubmitRead()}
            >
              Read clip
            </Button>
          ) : (
            <Button type="button" size="icon" aria-label="Send message" onClick={handleSendText}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
