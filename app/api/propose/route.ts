import { NextResponse } from "next/server";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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
  const source = (record as { source?: unknown }).source;
  const reason = (record as { reason?: unknown }).reason;
  const link = (record as { link?: unknown }).link;

  if (!isNonEmptyString(source) || !isNonEmptyString(reason)) {
    return NextResponse.json(
      { error: "Source and reason are required." },
      { status: 400 },
    );
  }

  // No persistent proposal queue is wired up yet -- this just confirms
  // intake, same as /api/subscribe and /api/poll. A real review workflow
  // needs a data store before proposals can be tracked or acted on.
  console.log(
    `[propose] source="${source}" link="${typeof link === "string" ? link : ""}" reason="${reason}"`,
  );

  return NextResponse.json({ ok: true });
}
