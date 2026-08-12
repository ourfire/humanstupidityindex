import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { computeIndex } from "@/lib/index";
import type { HsiData } from "@/lib/types";

export const alt = "Human Stupidity Index";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadData(): Promise<HsiData> {
  const file = path.join(process.cwd(), "data", "hsi.json");
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as HsiData;
}

export default async function OpengraphImage() {
  const data = await loadData();
  const { index } = computeIndex(data);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#FAFAF8",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 32,
            letterSpacing: 4,
            color: "#6E6E6A",
            textTransform: "uppercase",
          }}
        >
          Human Stupidity Index
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 320,
            fontWeight: 800,
            color: "#0A0A0A",
            lineHeight: 1,
            marginTop: 24,
          }}
        >
          {index.toFixed(1)}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#6E6E6A",
            marginTop: 24,
          }}
        >
          0 = cooperation for shared benefit · 100 = self-annihilation
        </div>
      </div>
    ),
    { ...size },
  );
}
