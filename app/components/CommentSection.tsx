"use client";

import { useEffect, useState, type FormEvent } from "react";

type Comment = {
  id: string;
  body: string;
  displayName: string | null;
  createdAt: string;
};

type LoadStatus = "loading" | "ready" | "error";
type SubmitStatus = "idle" | "loading" | "error";

const MAX_BODY_LENGTH = 500;
const MAX_NAME_LENGTH = 40;

function formatTimestamp(iso: string): string {
  return `${new Date(iso).toISOString().slice(0, 16).replace("T", " ")} UTC`;
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [body, setBody] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/comments")
      .then((response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json() as Promise<{ comments: Comment[] }>;
      })
      .then((data) => {
        if (!cancelled) {
          setComments(data.comments);
          setLoadStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitStatus("loading");
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, displayName: displayName || null }),
      });
      if (!response.ok) throw new Error("submit failed");
      const data = (await response.json()) as { comment: Comment };
      setComments((current) => [data.comment, ...current]);
      setBody("");
      setDisplayName("");
      setSubmitStatus("idle");
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        <label className="block">
          <span className="font-utility text-mute mb-2 block text-xs tracking-[0.08em] uppercase">
            Pseudonym or handle, optional
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="anonymous by default"
            maxLength={MAX_NAME_LENGTH}
            className="border-rule text-ink focus-visible:border-ink font-utility w-full border-b bg-transparent py-2 text-sm outline-none"
          />
        </label>
        <label className="block">
          <span className="font-utility text-mute mb-2 block text-xs tracking-[0.08em] uppercase">
            Comment
          </span>
          <textarea
            required
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={MAX_BODY_LENGTH}
            className="border-rule text-ink focus-visible:border-ink font-utility w-full resize-none border-b bg-transparent py-2 text-sm outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={submitStatus === "loading"}
          className="font-utility border-ink border-b pb-2 text-xs tracking-[0.08em] uppercase disabled:opacity-50"
        >
          Post
        </button>
        {submitStatus === "error" && (
          <p className="font-utility text-mute text-xs">
            Something went wrong. Try again.
          </p>
        )}
      </form>

      <div className="mt-10 max-w-[62ch] space-y-6">
        {loadStatus === "loading" && (
          <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
            Loading comments...
          </p>
        )}
        {loadStatus === "error" && (
          <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
            Comments are unavailable right now.
          </p>
        )}
        {loadStatus === "ready" && comments.length === 0 && (
          <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
            No comments yet.
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border-rule border-t pt-4">
            <p className="font-utility text-mute text-xs tracking-[0.08em] uppercase">
              {comment.displayName ?? `Anonymous #${comment.id}`} ·{" "}
              {formatTimestamp(comment.createdAt)}
            </p>
            <p className="font-body mt-2 text-base leading-[1.6]">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
