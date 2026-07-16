import { Room, RoomEvent, Track } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLivekitHealth, fetchLivekitToken } from "../api/client";

export type TalkState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export function useLiveKitTalkSession() {
  const roomRef = useRef<Room | null>(null);
  const audioEls = useRef<HTMLAudioElement[]>([]);
  const [state, setState] = useState<TalkState>("idle");
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [livekitOk, setLivekitOk] = useState<boolean | null>(null);

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
    if (room) await room.disconnect();
    setMuted(false);
    setState("idle");
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setState("connecting");
    try {
      const token = await fetchLivekitToken();
      const room = new Room();
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
      room.on(RoomEvent.Disconnected, () => {
        cleanupAudio();
        roomRef.current = null;
        setState("idle");
      });

      await room.connect(token.serverUrl, token.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);
      setMuted(false);
      setState("listening");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
      await disconnect();
      setState("error");
    }
  }, [disconnect]);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !muted;
    await room.localParticipant.setMicrophoneEnabled(!next);
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
    connected: state !== "idle" && state !== "error" && state !== "connecting",
    onFabClick,
    hangUp: disconnect,
    connect,
  };
}
