import { useEffect, useRef } from "react";
import { useLiveKitTalkSession, type TalkState } from "./useLiveKitTalkSession";
import "./voice-fab.css";

function labelFor(state: TalkState, muted: boolean): string {
  if (state === "idle") return "Talk to company";
  if (state === "connecting") return "Connecting…";
  if (state === "error") return "Voice error — tap to retry";
  if (muted) return "Mic muted — tap to unmute";
  if (state === "speaking") return "Agent speaking";
  if (state === "thinking") return "Thinking…";
  return "Listening — tap to mute";
}

function MicIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {muted ? (
        <>
          <path
            d="M4 4l16 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M5 11a7 7 0 0 0 11 5" stroke="currentColor" strokeWidth="2" />
        </>
      ) : (
        <>
          <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M5 11a7 7 0 0 0 14 0M12 18v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export function VoiceFab() {
  const session = useLiveKitTalkSession();
  const connectRef = useRef(session.connect);
  connectRef.current = session.connect;

  useEffect(() => {
    const onReq = () => void connectRef.current();
    window.addEventListener("occ-talk-connect", onReq);
    return () => window.removeEventListener("occ-talk-connect", onReq);
  }, []);

  const showHang =
    session.state === "listening" ||
    session.state === "speaking" ||
    session.state === "thinking" ||
    (session.state !== "idle" && session.state !== "error" && session.muted);

  return (
    <div className="j-voice-fab-wrap" data-state={session.state}>
      {session.error && (
        <div className="j-voice-fab-hint j-glass" role="status">
          {session.error}
          {session.livekitOk === false && (
            <div className="j-muted" style={{ marginTop: 4, fontSize: 11 }}>
              Start: npm run livekit:up · whisper:up · ollama serve · voice:up · agent:dev
            </div>
          )}
        </div>
      )}
      <div className="j-voice-fab-row">
        {showHang && (
          <button
            type="button"
            className="j-voice-fab-hang"
            aria-label="End call"
            title="End call"
            onClick={() => void session.hangUp()}
          >
            ×
          </button>
        )}
        <button
          type="button"
          className="j-voice-fab"
          data-state={session.state}
          data-muted={session.muted}
          aria-label={labelFor(session.state, session.muted)}
          title={labelFor(session.state, session.muted)}
          onClick={() => void session.onFabClick()}
        >
          <span className="j-voice-fab-icon">
            {session.state === "connecting" ? (
              <span className="j-mono">…</span>
            ) : (
              <MicIcon muted={session.muted} />
            )}
          </span>
        </button>
      </div>
      <p className="j-voice-fab-caption j-muted">{labelFor(session.state, session.muted)}</p>
    </div>
  );
}

export function requestTalkConnect() {
  window.dispatchEvent(new CustomEvent("occ-talk-connect"));
}
