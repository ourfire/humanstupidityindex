"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "done" | "error";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("subscribe failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
        Confirmed.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md items-end gap-4">
      <label className="flex-1">
        <span className="font-utility text-mute mb-2 block text-xs tracking-[0.08em] uppercase">
          Get the next reading.
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="border-rule text-ink focus-visible:border-ink font-utility w-full border-b bg-transparent py-2 text-sm outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-utility border-ink pb-2 text-xs tracking-[0.08em] uppercase disabled:opacity-50"
      >
        Subscribe
      </button>
      {status === "error" && (
        <p className="font-utility text-mute text-xs">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
