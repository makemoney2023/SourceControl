/**
 * LiveKit SpeechHandle.cancel() does `initFut.reject(new Error())` with no waiter.
 * After hard-route beforeLLM returns false, validateReplyIfPossible later interrupt()s
 * leftover replies → unhandled rejection → job ERROR (empty message) and silence.
 *
 * Package exports block importing SpeechHandle directly, so we load the dist file
 * by absolute path and also swallow the known empty cancel rejection.
 */
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let patched = false;

export function patchSpeechHandleCancel(): void {
  if (patched) return;
  patched = true;

  process.on("unhandledRejection", (reason) => {
    const err = reason instanceof Error ? reason : null;
    if (
      err &&
      err.message === "" &&
      typeof err.stack === "string" &&
      err.stack.includes("SpeechHandle.cancel")
    ) {
      console.warn("[jarvis] swallowed SpeechHandle.cancel rejection");
      return;
    }
  });

  try {
    const require = createRequire(import.meta.url);
    const speechHandlePath = join(
      dirname(fileURLToPath(import.meta.url)),
      "../node_modules/@livekit/agents/dist/pipeline/speech_handle.js",
    );
    const { SpeechHandle } = require(speechHandlePath) as {
      SpeechHandle: {
        prototype: {
          cancel: () => void;
          interrupt: () => void;
          waitForInitialization: () => Promise<void>;
        };
      };
    };
    const proto = SpeechHandle.prototype;
    const origCancel = proto.cancel;
    proto.cancel = function cancel(this: typeof proto) {
      void this.waitForInitialization().catch(() => {});
      return origCancel.call(this);
    };
    const origInterrupt = proto.interrupt;
    proto.interrupt = function interrupt(this: typeof proto) {
      try {
        return origInterrupt.call(this);
      } catch {
        // "interruptions are not allowed" on hard-route replies
      }
    };
    console.info("[jarvis] SpeechHandle cancel/interrupt patched");
  } catch (err) {
    console.warn(
      "[jarvis] SpeechHandle prototype patch skipped:",
      err instanceof Error ? err.message : err,
    );
  }
}
