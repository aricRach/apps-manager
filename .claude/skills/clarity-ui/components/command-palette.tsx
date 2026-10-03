"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface CommandItemDef {
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  action: () => void;
}

interface CommandGroupDef {
  label: string;
  items: CommandItemDef[];
}

interface CommandPaletteProps {
  groups: CommandGroupDef[];
}

export function CommandPalette({ groups }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  const filtered = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

      {/* Palette */}
      <div className="fixed inset-x-3 top-[12%] rounded-lg border border-border bg-bg-elevated shadow-lg sm:inset-x-auto sm:left-1/2 sm:top-[20%] sm:w-full sm:max-w-lg sm:-translate-x-1/2">
        {/* Search input */}
        <div className="flex items-center border-b border-border px-4">
          <svg className="h-4 w-4 text-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 border-0 bg-transparent px-3 py-3.5 text-base text-fg-primary placeholder:text-fg-muted focus:outline-none sm:py-3 sm:text-sm"
          />
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-fg-muted">No results found.</p>
          )}
          {filtered.map((group, groupIdx) => (
            <div key={group.label}>
              {groupIdx > 0 && <div className="my-1 h-px bg-border" />}
              <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-fg-muted">
                {group.label}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-fg-primary hover:bg-bg-hover"
                >
                  <item.icon className="h-5 w-5 text-fg-muted" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="text-xs text-fg-muted">{item.shortcut}</kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
