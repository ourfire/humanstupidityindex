"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";
type Answer = "yes" | "no";

const QUESTION =
  "Should this index be tradeable, like a prediction market or a financial derivative, on this site?";

export function TradeabilityPoll() {
  const [status, setStatus] = useState<Status>("idle");

  async function vote(answer: Answer) {
    setStatus("loading");
    try {
      const response = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      if (!response.ok) throw new Error("poll failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
        Recorded.
      </p>
    );
  }

  return (
    <div className="max-w-md">
      <p className="font-body text-lg leading-[1.6]">{QUESTION}</p>
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={() => vote("yes")}
          disabled={status === "loading"}
          className="font-utility border-ink border-b pb-2 text-xs tracking-[0.08em] uppercase disabled:opacity-50"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => vote("no")}
          disabled={status === "loading"}
          className="font-utility border-ink border-b pb-2 text-xs tracking-[0.08em] uppercase disabled:opacity-50"
        >
          No
        </button>
      </div>
      {status === "error" && (
        <p className="font-utility text-mute mt-2 text-xs">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
