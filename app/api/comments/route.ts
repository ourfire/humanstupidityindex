import { NextResponse } from "next/server";
import {
  listComments,
  createComment,
  checkRateLimit,
  MAX_BODY_LENGTH,
} from "@/lib/comments";

export async function GET() {
  try {
    const comments = await listComments();
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json(
      { error: "Comments are unavailable right now." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const record = typeof body === "object" && body !== null ? body : {};
  const text = (record as { body?: unknown }).body;
  const displayName = (record as { displayName?: unknown }).displayName;

  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment text is required." },
      { status: 400 },
    );
  }
  if (text.trim().length > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: `Comments are limited to ${MAX_BODY_LENGTH} characters.` },
      { status: 400 },
    );
  }
  if (
    displayName !== undefined &&
    displayName !== null &&
    typeof displayName !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid display name." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  try {
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many comments. Try again later." },
        { status: 429 },
      );
    }
    const comment = await createComment(
      text,
      typeof displayName === "string" ? displayName : null,
    );
    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json(
      { error: "Comments are unavailable right now." },
      { status: 503 },
    );
  }
}
