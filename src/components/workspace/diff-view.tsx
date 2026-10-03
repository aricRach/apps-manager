"use client";

import { MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommentTarget, DiffFile } from "@/lib/types";

interface DiffLine {
  type: "hunk" | "add" | "del" | "ctx";
  text: string;
  oldLine?: number;
  newLine?: number;
}

function parsePatch(patch: string): DiffLine[] {
  const lines: DiffLine[] = [];
  let oldLine = 0;
  let newLine = 0;

  for (const raw of patch.split("\n")) {
    if (raw.startsWith("@@")) {
      const match = /@@ -(\d+)(?:,\d+)? \+(\d+)/.exec(raw);
      oldLine = match ? Number(match[1]) : 0;
      newLine = match ? Number(match[2]) : 0;
      lines.push({ type: "hunk", text: raw });
    } else if (raw.startsWith("+")) {
      lines.push({ type: "add", text: raw.slice(1), newLine: newLine++ });
    } else if (raw.startsWith("-")) {
      lines.push({ type: "del", text: raw.slice(1), oldLine: oldLine++ });
    } else if (!raw.startsWith("\\")) {
      lines.push({ type: "ctx", text: raw.slice(1), oldLine: oldLine++, newLine: newLine++ });
    }
  }
  return lines;
}

const lineStyles: Record<DiffLine["type"], string> = {
  hunk: "bg-bg-secondary text-fg-muted",
  add: "bg-status-success-bg",
  del: "bg-status-error-bg",
  ctx: "",
};

const marker: Record<DiffLine["type"], string> = { hunk: "", add: "+", del: "-", ctx: "" };

interface DiffViewProps {
  files: DiffFile[];
  activeComment: CommentTarget | null;
  onComment: (target: CommentTarget) => void;
}

export function DiffView({ files, activeComment, onComment }: DiffViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {files.map((file) => (
        <div key={file.filename} className="overflow-hidden rounded-md border border-border">
          <div className="flex items-center justify-between gap-4 border-b border-border bg-bg-secondary px-4 py-3">
            <span className="truncate font-mono text-sm text-fg-primary" dir="ltr">
              {file.filename}
            </span>
            <span className="flex flex-shrink-0 items-center gap-2 font-mono text-xs">
              <span className="text-status-success">+{file.additions}</span>
              <span className="text-status-error">-{file.deletions}</span>
            </span>
          </div>

          {file.patch ? (
            <div className="overflow-x-auto" dir="ltr">
              <table className="w-full border-collapse font-mono text-xs">
                <tbody>
                  {parsePatch(file.patch).map((line, i) => {
                    const canComment = line.newLine !== undefined;
                    const isActive =
                      canComment &&
                      activeComment?.file === file.filename &&
                      activeComment.line === line.newLine;
                    return (
                      <tr
                        key={i}
                        className={cn("group", lineStyles[line.type], isActive && "bg-accent-subtle")}
                      >
                        <td className="w-10 select-none px-2 text-right align-top text-fg-muted">
                          {line.oldLine}
                        </td>
                        <td className="w-10 select-none px-2 text-right align-top text-fg-muted">
                          {line.newLine}
                        </td>
                        <td className="w-6 align-top">
                          {canComment && (
                            <button
                              type="button"
                              aria-label={`Comment on line ${line.newLine}`}
                              onClick={() => onComment({ file: file.filename, line: line.newLine! })}
                              className="flex h-5 w-5 items-center justify-center rounded-sm text-accent opacity-0 transition-colors duration-75 hover:bg-bg-hover focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                            >
                              <MessageSquarePlus className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                        <td className="w-4 select-none align-top text-fg-muted">{marker[line.type]}</td>
                        <td className="w-full whitespace-pre py-0.5 pr-4 text-fg-primary">{line.text}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-fg-muted">
              No text diff available ({file.status}).
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
