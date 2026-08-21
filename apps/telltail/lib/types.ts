export const LITE_READS_GRANT = 5;
export const VISION_MODEL = "gemini-3.5-flash-lite";
export const PLUS_STUBBED = true;

export type RefuseReason =
  | "kids-in-frame"
  | "bite-risk"
  | "medical"
  | "confidence-floor"
  | "no-media"
  | "quota-exhausted"
  | "api-unavailable";

export interface GateSignals {
  freeze?: boolean;
  whale_eye?: boolean;
  hard_stare?: boolean;
  growling?: boolean;
  snapping?: boolean;
}

export interface VisionReadResult {
  refuse: boolean;
  refuse_reason: RefuseReason | null;
  child_in_frame: boolean;
  confidence: "low" | "medium" | "high";
  confidence_note: string;
  signals: string[];
  gate_inputs: GateSignals;
  actions: string[];
  stop_rule: string;
  escalate: string;
  notes: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface TextMessage {
  id: string;
  role: MessageRole;
  kind: "text";
  text: string;
  createdAt: number;
}

export interface MediaAttachment {
  name: string;
  mimeType: string;
  dataUrl: string;
}

export interface MediaMessage {
  id: string;
  role: "user";
  kind: "media";
  text?: string;
  attachment: MediaAttachment;
  createdAt: number;
}

export interface RefuseCardMessage {
  id: string;
  role: "assistant";
  kind: "refuse";
  title: string;
  body: string;
  reason: RefuseReason;
  escalate: string;
  createdAt: number;
}

export interface MomentCardMessage {
  id: string;
  role: "assistant";
  kind: "moment";
  signals: string[];
  confidence: "low" | "medium" | "high";
  confidence_note: string;
  actions: string[];
  stop_rule: string;
  createdAt: number;
}

export interface PaywallStubMessage {
  id: string;
  role: "assistant";
  kind: "paywall-stub";
  createdAt: number;
}

export type ThreadMessage =
  | TextMessage
  | MediaMessage
  | RefuseCardMessage
  | MomentCardMessage
  | PaywallStubMessage;

export interface LiteQuota {
  remaining: number;
  total: number;
  readsUsed: number;
}
