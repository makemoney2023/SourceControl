import { describe, expect, it } from "vitest";
import { livekitEnv, mintTalkToken } from "./livekit-token";

describe("mintTalkToken", () => {
  it("returns jwt-like token and ws url", async () => {
    process.env.LIVEKIT_URL = "ws://127.0.0.1:7880";
    process.env.LIVEKIT_API_KEY = "devkey";
    process.env.LIVEKIT_API_SECRET = "secret";
    const t = await mintTalkToken({ roomName: "occ-test", identity: "operator" });
    expect(t.serverUrl).toContain("7880");
    expect(t.participantToken.split(".").length).toBe(3);
    expect(t.agentName).toBe("situation-room");
    expect(t.roomName).toBe("occ-test");
  });

  it("defaults env", () => {
    delete process.env.LIVEKIT_API_KEY;
    const e = livekitEnv();
    expect(e.apiKey).toBe("devkey");
    expect(e.agentName).toBe("situation-room");
  });
});
