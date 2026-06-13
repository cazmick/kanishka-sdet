import { useEffect, useRef, useState } from "react";
import { Volume2, Pause, Play } from "lucide-react";
import { CV_CONTEXT } from "@/lib/cv-context";

// Strip markdown-ish characters & urls for cleaner narration
function cleanForSpeech(raw: string) {
  return raw
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[#*_`>|=]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CVSpeaker() {
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleClick = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;

    if (state === "idle") {
      const u = new SpeechSynthesisUtterance(cleanForSpeech(CV_CONTEXT));
      u.rate = 1;
      u.pitch = 1;
      u.lang = "en-US";
      u.onend = () => setState("idle");
      u.onerror = () => setState("idle");
      utterRef.current = u;
      synth.cancel();
      synth.speak(u);
      setState("playing");
    } else if (state === "playing") {
      synth.pause();
      setState("paused");
    } else if (state === "paused") {
      synth.resume();
      setState("playing");
    }
  };

  if (!supported) return null;

  const Icon = state === "playing" ? Pause : state === "paused" ? Play : Volume2;
  const label =
    state === "playing" ? "Pause CV narration" : state === "paused" ? "Resume CV narration" : "Listen to CV";

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="fixed bottom-5 right-24 z-50 grid h-11 w-11 place-items-center rounded-full text-white shadow-xl transition-transform hover:scale-105 md:bottom-8 md:right-28"
      style={{
        background:
          "var(--gradient-cyan-magenta, linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.7 0.22 320)))",
        boxShadow: "0 8px 30px oklch(0.78 0.18 195 / 0.4)",
      }}
    >
      <Icon className="h-5 w-5" />
      {state === "playing" && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full animate-ping"
          style={{ background: "oklch(0.78 0.18 195 / 0.35)" }}
        />
      )}
    </button>
  );
}
