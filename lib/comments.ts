import { Redis } from "@upstash/redis";
import { randomBytes, createHash } from "node:crypto";

const COMMENTS_KEY = "hsi:comments";
const MAX_COMMENTS = 500;
export const MAX_BODY_LENGTH = 500;
export const MAX_NAME_LENGTH = 40;
const RATE_LIMIT_WINDOW_SECONDS = 600;
const RATE_LIMIT_MAX = 5;

export type Comment = {
  id: string;
  body: string;
  displayName: string | null;
  createdAt: string;
};

function redis(): Redis {
  return Redis.fromEnv();
}

export async function listComments(limit = 100): Promise<Comment[]> {
  const raw = await redis().lrange<string>(COMMENTS_KEY, 0, limit - 1);
  return raw.map((entry) =>
    typeof entry === "string" ? (JSON.parse(entry) as Comment) : entry,
  );
}

export async function createComment(
  body: string,
  displayName: string | null,
): Promise<Comment> {
  const comment: Comment = {
    id: randomBytes(4).toString("hex"),
    body: body.trim().slice(0, MAX_BODY_LENGTH),
    displayName: displayName?.trim().slice(0, MAX_NAME_LENGTH) || null,
    createdAt: new Date().toISOString(),
  };
  const client = redis();
  await client.lpush(COMMENTS_KEY, JSON.stringify(comment));
  await client.ltrim(COMMENTS_KEY, 0, MAX_COMMENTS - 1);
  return comment;
}

// IP is only ever hashed and used as a short-TTL rate-limit counter key,
// never stored alongside a comment or logged in the clear.
export async function checkRateLimit(ip: string): Promise<boolean> {
  const hashed = createHash("sha256").update(ip).digest("hex");
  const key = `hsi:ratelimit:comments:${hashed}`;
  const client = redis();
  const count = await client.incr(key);
  if (count === 1) {
    await client.expire(key, RATE_LIMIT_WINDOW_SECONDS);
  }
  return count <= RATE_LIMIT_MAX;
}
