import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";
import { AccessToken, type VideoGrant } from "livekit-server-sdk";

export function livekitEnv() {
  return {
    url: process.env.LIVEKIT_URL || "ws://127.0.0.1:7880",
    apiKey: process.env.LIVEKIT_API_KEY || "devkey",
    apiSecret: process.env.LIVEKIT_API_SECRET || "secret",
    agentName: process.env.LIVEKIT_AGENT_NAME || "situation-room",
  };
}

export async function mintTalkToken(opts?: {
  roomName?: string;
  identity?: string;
}): Promise<{
  serverUrl: string;
  participantToken: string;
  roomName: string;
  agentName: string;
}> {
  const { url, apiKey, apiSecret, agentName } = livekitEnv();
  const roomName = opts?.roomName || `occ-${Date.now()}`;
  const identity = opts?.identity || "operator";

  const at = new AccessToken(apiKey, apiSecret, { identity, ttl: "1h" });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName })],
  });

  return {
    serverUrl: url,
    participantToken: await at.toJwt(),
    roomName,
    agentName,
  };
}

export async function probeLivekitHealth(): Promise<{ ok: boolean; detail: string }> {
  const { url } = livekitEnv();
  const httpUrl = url.replace(/^ws/, "http").replace(/\/$/, "");
  try {
    const res = await fetch(httpUrl, { signal: AbortSignal.timeout(2000) });
    return { ok: true, detail: `${httpUrl} HTTP ${res.status}` };
  } catch (e) {
    return {
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    };
  }
}
