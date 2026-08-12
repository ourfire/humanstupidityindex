export type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; text: string }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "ordered-list"; items: string[] };

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i++;
      }
      i++;
      blocks.push({ type: "code", text: codeLines.join("\n") });
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1]!.length as 1 | 2 | 3;
      blocks.push({ type: "heading", level, text: headingMatch[2]!.trim() });
      i++;
      continue;
    }

    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && (lines[i] ?? "").trim().startsWith("|")) {
        tableLines.push((lines[i] ?? "").trim());
        i++;
      }
      const [headerLine, , ...bodyLines] = tableLines;
      blocks.push({
        type: "table",
        header: splitRow(headerLine ?? ""),
        rows: bodyLines.map(splitRow),
      });
      continue;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length) {
        const current = lines[i] ?? "";
        if (/^\d+\.\s/.test(current.trim())) {
          items.push(current.trim().replace(/^\d+\.\s/, ""));
          i++;
        } else if (
          current.trim() !== "" &&
          !/^#{1,3}\s/.test(current) &&
          !current.trim().startsWith("|") &&
          !current.startsWith("```")
        ) {
          const lastIndex = items.length - 1;
          items[lastIndex] = `${items[lastIndex]} ${current.trim()}`;
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() !== "" &&
      !/^#{1,3}\s/.test(lines[i] ?? "") &&
      !(lines[i] ?? "").startsWith("```") &&
      !(lines[i] ?? "").trim().startsWith("|") &&
      !/^\d+\.\s/.test((lines[i] ?? "").trim())
    ) {
      paraLines.push((lines[i] ?? "").trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: paraLines.join(" ") });
  }

  return blocks;
}
