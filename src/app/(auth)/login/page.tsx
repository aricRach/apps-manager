"use client";

import { useState } from "react";
import { Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, InputError } from "@/components/ui/input";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/apps";
      return;
    }
    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Sign in failed");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Bot className="h-6 w-6 text-fg-on-accent" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-fg-primary">Apps Manager</h1>
          <p className="mt-1 text-sm text-fg-muted">Sign in to manage your apps</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-lg border border-border bg-bg-primary p-6 shadow-sm">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-fg-primary">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            error={!!error}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <InputError>{error}</InputError>}
          <Button type="submit" className="mt-4 w-full" disabled={loading || !password}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
