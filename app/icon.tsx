import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { computeIndex } from "@/lib/index";
import type { HsiData } from "@/lib/types";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

async function loadData(): Promise<HsiData> {
  const file = path.join(process.cwd(), "data", "hsi.json");
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as HsiData;
}

export default async function Icon() {
  const data = await loadData();
  const { index } = computeIndex(data);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          color: "#FAFAF8",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        {Math.round(index)}
      </div>
    ),
    { ...size },
  );
}
