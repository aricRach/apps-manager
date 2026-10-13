"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/modal-dialog";

const steps = [
  {
    title: "You give an instruction",
    body: "Open an app and choose Change, Ask, or review a pending change. The dashboard creates a request id for it.",
  },
  {
    title: "The dashboard starts a GitHub Action",
    body: "Using a GitHub token (GITHUB_TOKEN), the dashboard triggers the agent.yml workflow in the app's repository. No server or database of its own: all state lives in GitHub.",
  },
  {
    title: "Claude does the work",
    body: "The workflow calls the shared agent-run.yml workflow in apps-manager. A temporary GitHub runner installs Claude Code, which reads the code using the repo's ANTHROPIC_API_KEY secret.",
  },
  {
    title: "Results come back",
    body: "Change: Claude edits the code, commits to the agent-preview branch, and opens a pull request. Ask: Claude only reads the code, and its answer is uploaded as an artifact that the dashboard shows you.",
  },
  {
    title: "Preview, then approve",
    body: "Vercel or Netlify builds the agent-preview branch so you can try it live and read the diff. Merge to ship it, ask for a fix, or discard it.",
  },
];

const credentials = [
  { name: "DASHBOARD_PASSWORD", use: "Lets you log in to this dashboard." },
  {
    name: "GITHUB_TOKEN",
    use: "Fine-grained token the dashboard uses to start runs, read status and diffs, and merge or close pull requests.",
  },
  {
    name: "ANTHROPIC_API_KEY",
    use: "Secret in each app repo that lets Claude Code run inside GitHub Actions.",
  },
];

export function HowItWorksDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="How this app works">
          <Info className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent size="lg" className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How Apps Manager works</DialogTitle>
          <DialogDescription>
            You describe a change in plain words, Claude makes it in GitHub, and you review a live
            preview before anything goes to production.
          </DialogDescription>
        </DialogHeader>

        <ol className="mt-5 space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-fg-on-accent">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-fg-primary">{step.title}</p>
                <p className="text-sm text-fg-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="mt-6 text-sm font-semibold text-fg-primary">Keys and tokens</h3>
        <ul className="mt-2 divide-y divide-border rounded-md border border-border">
          {credentials.map((credential) => (
            <li key={credential.name} className="px-3 py-2">
              <p className="font-mono text-xs text-fg-primary">{credential.name}</p>
              <p className="text-sm text-fg-secondary">{credential.use}</p>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
