import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { parseMarkdown } from "@/lib/markdown";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean);
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="font-utility text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      return (
        <a
          key={key}
          href={linkMatch[2]}
          className="underline underline-offset-2"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

function Heading({
  level,
  children,
}: {
  level: 1 | 2 | 3;
  children: ReactNode;
}) {
  if (level === 1) {
    return <h3 className="font-display mt-10 text-2xl">{children}</h3>;
  }
  if (level === 2) {
    return <h4 className="font-display mt-8 text-xl">{children}</h4>;
  }
  return (
    <h5 className="font-utility mt-6 text-sm tracking-[0.08em] uppercase">
      {children}
    </h5>
  );
}

export function Methodology({
  file: fileName = "METHODOLOGY.md",
}: {
  file?: string;
}) {
  const file = path.join(process.cwd(), fileName);
  const source = fs.readFileSync(file, "utf-8");
  const blocks = parseMarkdown(source);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.type === "heading") {
          return (
            <Heading key={key} level={block.level}>
              {block.text}
            </Heading>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={key} className="max-w-[62ch] leading-[1.6]">
              {renderInline(block.text, key)}
            </p>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={key}
              className="font-utility border-rule overflow-x-auto border p-4 text-xs"
            >
              <code>{block.text}</code>
            </pre>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={key} className="max-w-[62ch] list-decimal space-y-2 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>
                  {renderInline(item, `${key}-${itemIndex}`)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <div key={key} className="max-w-full overflow-x-auto">
            <table className="font-utility w-full border-collapse text-xs tracking-[0.04em] uppercase">
              <thead>
                <tr className="text-mute">
                  {block.header.map((cell, cellIndex) => (
                    <th
                      key={cellIndex}
                      className="border-rule border-b py-2 pr-4 text-left"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border-rule text-ink border-b py-2 pr-4 normal-case"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
