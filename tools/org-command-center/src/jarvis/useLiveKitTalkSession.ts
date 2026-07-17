import { Room, RoomEvent, Track } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLivekitHealth, fetchLivekitToken } from "../api/client";
import {
  audioCaptureOptionsForMic,
  ensureMicPermission,
  listAudioInputs,
  pickPreferredMicDevice,
} from "./pick-mic-device";

export type TalkState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

async function resolveMicDeviceId(): Promise<{ deviceId?: string; label: string }> {
  await ensureMicPermission();
  const inputs = await listAudioInputs();
  const preferred = pickPreferredMicDevice(inputs);
  if (preferred) {
    return { deviceId: preferred.deviceId, label: preferred.label };
  }
  return { label: inputs[0]?.label || "system default" };
}

export function useLiveKitTalkSession() {
  const roomRef = useRef<Room | null>(null);
  const audioEls = useRef<HTMLAudioElement[]>([]);
  const micDeviceIdRef = useRef<string | undefined>(undefined);
  const micLabelRef = useRef<string>("");
  const [state, setState] = useState<TalkState>("idle");
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [livekitOk, setLivekitOk] = useState<boolean | null>(null);
  const [micLabel, setMicLabel] = useState<string | null>(null);
  const [heard, setHeard] = useState<string | null>(null);

  useEffect(() => {
    void fetchLivekitHealth()
      .then((h) => setLivekitOk(h.ok))
      .catch(() => setLivekitOk(false));
  }, []);

  const cleanupAudio = () => {
    for (const el of audioEls.current) {
      el.pause();
      el.srcObject = null;
      el.remove();
    }
    audioEls.current = [];
  };

  const disconnect = useCallback(async () => {
    cleanupAudio();
    const room = roomRef.current;
    roomRef.current = null;
    micDeviceIdRef.current = undefined;
    micLabelRef.current = "";
    if (room) await room.disconnect();
    setMuted(false);
    setMicLabel(null);
    setHeard(null);
    setState("idle");
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setHeard(null);
    setState("connecting");
    try {
      const mic = await resolveMicDeviceId();
      micDeviceIdRef.current = mic.deviceId;
      micLabelRef.current = mic.label;
      setMicLabel(mic.label);
      const capture = audioCaptureOptionsForMic(mic.deviceId, mic.label);

      const token = await fetchLivekitToken();
      const room = new Room({
        audioCaptureDefaults: capture,
      });
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === Track.Kind.Audio) {
          const el = track.attach() as HTMLAudioElement;
          el.autoplay = true;
          document.body.appendChild(el);
          audioEls.current.push(el);
          setState("speaking");
        }
      });
      room.on(RoomEvent.TrackUnsubscribed, () => {
        setState((s) => (s === "speaking" ? "listening" : s));
      });
      room.on(RoomEvent.TranscriptionReceived, (segments, participant) => {
        const text = segments
          .map((s) => s.text)
          .join(" ")
          .trim();
        if (!text) return;
        const isLocal = participant?.isLocal === true;
        if (isLocal) {
          setHeard(text);
          setState("listening");
        } else {
          setState("speaking");
        }
      });
      room.on(RoomEvent.Disconnected, () => {
        cleanupAudio();
        roomRef.current = null;
        setMicLabel(null);
        setHeard(null);
        setState("idle");
      });

      await room.connect(token.serverUrl, token.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true, capture);
      if (mic.deviceId) {
        try {
          await room.switchActiveDevice("audioinput", mic.deviceId);
        } catch {
          // already on device
        }
      }
      setMuted(false);
      setState("listening");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
      await disconnect();
      setState("error");
    }
  }, [disconnect]);

  useEffect(() => {
    if (!navigator.mediaDevices?.addEventListener) return;
    const onDeviceChange = () => {
      const room = roomRef.current;
      if (!room) return;
      void (async () => {
        const inputs = await listAudioInputs();
        const preferred = pickPreferredMicDevice(inputs);
        if (!preferred || preferred.deviceId === micDeviceIdRef.current) return;
        micDeviceIdRef.current = preferred.deviceId;
        micLabelRef.current = preferred.label;
        setMicLabel(preferred.label);
        const capture = audioCaptureOptionsForMic(preferred.deviceId, preferred.label);
        try {
          await room.switchActiveDevice("audioinput", preferred.deviceId);
          const pub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
          const audioTrack = pub?.track;
          if (audioTrack && "restartTrack" in audioTrack) {
            await (
              audioTrack as { restartTrack: (o: typeof capture) => Promise<void> }
            ).restartTrack(capture);
          }
        } catch {
          /* ignore */
        }
      })();
    };
    navigator.mediaDevices.addEventListener("devicechange", onDeviceChange);
    return () => navigator.mediaDevices.removeEventListener("devicechange", onDeviceChange);
  }, []);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !muted;
    const capture = audioCaptureOptionsForMic(micDeviceIdRef.current, micLabelRef.current);
    await room.localParticipant.setMicrophoneEnabled(!next, capture);
    setMuted(next);
  }, [muted]);

  const onFabClick = useCallback(async () => {
    if (state === "idle" || state === "error") {
      await connect();
      return;
    }
    if (state === "connecting") return;
    await toggleMute();
  }, [state, connect, toggleMute]);

  useEffect(() => {
    return () => {
      void disconnect();
    };
  }, [disconnect]);

  return {
    state,
    muted,
    error,
    livekitOk,
    micLabel,
    heard,
    connected: state !== "idle" && state !== "error" && state !== "connecting",
    onFabClick,
    hangUp: disconnect,
    connect,
  };
}
