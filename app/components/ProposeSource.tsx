"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "done" | "error";

export function ProposeSource() {
  const [source, setSource] = useState("");
  const [link, setLink] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, link, reason }),
      });
      if (!response.ok) throw new Error("propose failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
        Received. Not every proposal is added, but every one is read.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <label className="block">
        <span className="font-utility text-mute mb-2 block text-xs tracking-[0.08em] uppercase">
          Data source or indicator
        </span>
        <input
          type="text"
          required
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="e.g. UNODC intentional homicide rate"
          className="border-rule text-ink focus-visible:border-ink font-utility w-full border-b bg-transparent py-2 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="font-utility text-mute mb-2 block text-xs tracking-[0.08em] uppercase">
          Link, if you have one
        </span>
        <input
          type="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://"
          className="border-rule text-ink focus-visible:border-ink font-utility w-full border-b bg-transparent py-2 text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="font-utility text-mute mb-2 block text-xs tracking-[0.08em] uppercase">
          Why it belongs
        </span>
        <textarea
          required
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="border-rule text-ink focus-visible:border-ink font-utility w-full resize-none border-b bg-transparent py-2 text-sm outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-utility border-ink border-b pb-2 text-xs tracking-[0.08em] uppercase disabled:opacity-50"
      >
        Submit
      </button>
      {status === "error" && (
        <p className="font-utility text-mute text-xs">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
