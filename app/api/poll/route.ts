import { NextResponse } from "next/server";

type Answer = "yes" | "no";

function isAnswer(value: unknown): value is Answer {
  return value === "yes" || value === "no";
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

  const answer =
    typeof body === "object" && body !== null && "answer" in body
      ? (body as { answer: unknown }).answer
      : null;

  if (!isAnswer(answer)) {
    return NextResponse.json(
      { error: "Answer must be 'yes' or 'no'." },
      { status: 400 },
    );
  }

  // No persistent vote tally is wired up yet -- this just confirms intake,
  // same as /api/subscribe. A real count needs a data store before this
  // question can report results back to visitors.
  console.log(`[poll:tradeability] ${answer}`);

  return NextResponse.json({ ok: true });
}
