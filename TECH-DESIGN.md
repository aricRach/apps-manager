# Apps Manager: Technical Design

A dashboard for changing, asking about, and reviewing your apps through a coding agent.
You type an instruction, an agent edits the app's code on a branch, you see a live preview
and the code diff, and you approve (merge) or ask for a fix.

Status as of 2026-10-03: working end to end for one app, **Football** (`aricRach/Teams`, Netlify, Firebase Auth).
The original product plan is in `app-manager-plan.md`.

## Contents

1. [Architecture](#1-architecture)
2. [How the systems integrate](#2-how-the-systems-integrate)
3. [Flows](#3-flows)
4. [Code map](#4-code-map)
5. [Design decisions](#5-design-decisions)
6. [Setup guides](#6-setup-guides)
7. [Adding another app](#7-adding-another-app)
8. [Known limits](#8-known-limits)
9. [Things that expire or can stop working](#9-things-that-expire-or-can-stop-working)

---

## 1. Architecture

```
 You (browser)
    │  password login
    ▼
 Dashboard (Next.js, this repo)
    │  GitHub REST API, using GITHUB_TOKEN
    ▼
 GitHub ── app repo (aricRach/Teams)
    │        .github/workflows/agent.yml        thin "caller" workflow
    │              │ calls
    │              ▼
    │        aricRach/apps-manager
    │        .github/workflows/agent-run.yml    central workflow
    │              │ runs on a temporary GitHub Actions runner
    │              ▼
    │        Claude Code (headless), using ANTHROPIC_API_KEY
    │              │ commit + push to branch "agent-preview", opens a pull request
    ▼              ▼
 Netlify ── builds the branch ──► https://agent-preview--teams-rach.netlify.app
    ▲                                        │
    └──────── shown in the dashboard iframe ─┘
                                             │ Google sign-in
                                             ▼
                                   Firebase Auth (project rach-teams)
```

There is no server or database of our own. The dashboard is stateless: everything it shows
comes from GitHub (runs, branch, pull request, diff, build status). The only local state is
the browser's memory of the in-flight run.

## 2. How the systems integrate

| From → To | What happens | Credential |
|---|---|---|
| Browser → Dashboard | Login, all dashboard actions | `DASHBOARD_PASSWORD` (session cookie, 30 days) |
| Dashboard → GitHub | Start a run, read run status, read diff, merge or close the pull request, delete the branch | `GITHUB_TOKEN` (fine-grained personal access token) |
| App repo workflow → central workflow | `agent.yml` in the app repo calls `agent-run.yml` in `aricRach/apps-manager@main` | None; `apps-manager` must be public because `Teams` is public |
| Actions runner → Anthropic | Claude Code reads and edits the code | `ANTHROPIC_API_KEY` secret in the app repo |
| Actions runner → GitHub | Push the branch, open the pull request, upload the answer | Built-in per-run Actions token (automatic) |
| GitHub → Netlify | Netlify builds every push to `agent-preview` | Netlify's GitHub connection |
| Preview → Firebase | Google sign-in inside the preview | Firebase "Authorized domains" list |

Two details make the pieces find each other:

- **Finding the run.** GitHub does not return which run a dispatch created. The dashboard
  generates a request id, the caller workflow puts it in its `run-name`, and the dashboard
  finds the run by that id.
- **Returning an answer.** In Ask mode the workflow uploads the answer as an artifact named
  `answer-<request id>`. The dashboard downloads and unzips it.

## 3. Flows

All three modes use the same workflow with a `mode` input.

### Change
1. Dashboard sends `mode=change`, `branch=agent-preview`, the instruction, and a title.
2. Workflow creates `agent-preview` from `master`, runs Claude Code, commits, pushes, and opens a pull request.
3. Netlify builds the branch. The dashboard polls GitHub every 5 seconds and shows the preview when the build reports success.
4. **Approve** squash-merges the pull request into `master` and deletes the branch. Netlify then publishes production.
5. **Discard** closes the pull request and deletes the branch.

### Fix (a change while one is pending)
Same as Change, but the workflow checks out the existing `agent-preview` and adds a commit.
Because the merge is a squash, `master` still gets one clean commit.

### Review comment
In the **Changes** tab, clicking a line attaches `file:line` to your next message. The
dashboard sends `mode=review-comment` and tells the agent to change only what the comment asks.

### Ask
Read-only. The agent may only read files and run `git diff` / `git log`. No branch, commit,
or preview. If a change is pending, the question runs on that branch, so you can ask "why
did you do it this way?".

The agent has no access to the database, so it can explain code but not answer questions
about live data.

## 4. Code map

| Path | Purpose |
|---|---|
| `src/config/apps.ts` | Registry of managed apps (repo, platform, branch, Netlify site) |
| `src/lib/github.ts` | Every GitHub API call |
| `src/lib/auth.ts`, `src/middleware.ts` | Password login and route protection |
| `src/lib/types.ts` | Shared types, the fixed branch name, input validation patterns |
| `src/app/api/apps/[id]/runs` | Start a run |
| `src/app/api/apps/[id]/status` | Run, branch, pull request and preview state |
| `src/app/api/apps/[id]/diff` | Diff of the branch against the default branch |
| `src/app/api/apps/[id]/merge`, `discard` | Approve or discard |
| `src/app/api/apps/[id]/sessions` | Open agent pull requests (to resume after a reload) |
| `src/components/workspace/` | The app page: composer, status, preview, diff |
| `src/components/ui/`, `layout/` | clarity-ui components |
| `.github/workflows/agent-run.yml` | Central agent workflow |
| `templates/caller-workflow.yml` | File to copy into each app repo as `.github/workflows/agent.yml` |
| `.claude/skills/clarity-ui/` | The design system skill used to build the UI |

## 5. Design decisions

- **GitHub Actions as the engine.** No server to run or pay for. The `Teams` repo is public, so Actions minutes are free.
- **One fixed branch per app (`agent-preview`).** Netlify gives each pull request a new preview
  domain, and Firebase's authorized-domain list has no wildcards. A fixed branch gives one
  stable address that is authorized once. The cost: one pending change per app at a time.
- **Leftover cleanup.** If `agent-preview` exists with no open pull request (a run pushed but
  failed before opening one), starting a new change deletes it first. If a pull request is
  open, the dashboard refuses and asks you to approve or discard.
- **Squash merge.** Fix rounds do not clutter `master`.
- **Limited agent permissions.** In Change mode the agent can edit files and run `npm`
  scripts, but has no general shell access. In Ask mode it cannot edit.
- **Branch name validation.** Merge, discard and diff only accept branches matching `agent-…`,
  so the dashboard can never merge or delete one of your own branches.
- **Preview uses the production database.** Anything you do in the preview affects live data.

## 6. Setup guides

### 6.1 Dashboard environment variables

Create `.env.local` in the project root (it is ignored by git):

```
DASHBOARD_PASSWORD=<a long password you choose>
GITHUB_TOKEN=github_pat_...
```

Run with `npm run dev` and open http://localhost:3000. If you deploy the dashboard to
Vercel, set the same two variables under the project's Settings → Environment Variables.

### 6.2 Generate the GitHub token

1. GitHub → avatar → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Resource owner:** `aricRach`. Choose an expiration and note the date.
3. **Repository access:** Only select repositories → the managed app repos (`Teams`).
4. **Repository permissions:**

   | Permission | Access |
   |---|---|
   | Actions | Read and write |
   | Contents | Read and write |
   | Pull requests | Read and write |
   | Deployments | Read-only |
   | Commit statuses | Read-only |

5. Generate and copy the token immediately; GitHub shows it once. Put it in `.env.local`.

### 6.3 Central workflow repo

`aricRach/apps-manager` (this repo) holds `agent-run.yml` on `main`. It must stay public
while it is called from a public app repo.

### 6.4 Per-app repo setup (done for `Teams`)

1. Copy `templates/caller-workflow.yml` to `.github/workflows/agent.yml` on the repo's **default branch** (`master` for Teams).
2. Add the secret: Settings → Secrets and variables → Actions → **New repository secret** → `ANTHROPIC_API_KEY`, with a key from console.anthropic.com.
3. Settings → Actions → General → Workflow permissions → tick **Allow GitHub Actions to create and approve pull requests**.

### 6.5 Netlify: stable preview address

Site `teams-rach` → Site configuration → Build & deploy → Branches and deploy contexts →
**Branch deploys**: All (or add `agent-preview`). This makes Netlify serve the branch at
`https://agent-preview--teams-rach.netlify.app`.

### 6.6 Firebase: allow sign-in on the preview

Firebase console → project `rach-teams` → Authentication → Settings → **Authorized domains**
→ Add domain → `agent-preview--teams-rach.netlify.app` (no `https://`).

### 6.7 Registry entry

`src/config/apps.ts`:

```ts
{
  id: "football",
  name: "Football",
  repo: "aricRach/Teams",
  platform: "netlify",
  productionUrl: "https://teams-rach.netlify.app",
  defaultBranch: "master",
  workflowFile: "agent.yml",
  netlifySite: "teams-rach",
}
```

## 7. Adding another app

Follow the step-by-step checklist in [`ADDING-AN-APP.md`](ADDING-AN-APP.md). It covers the token,
the workflow file, the repo settings, Netlify, login domains, the registry entry, a test
sequence, and a troubleshooting table.

## 8. Known limits

- One pending change per app at a time.
- "Ready for review" can appear slightly before the branch address has the newest build. Use the reload button above the preview.
- An Ask answer is kept only in the open page; a reload clears it.
- No rate limiting on login attempts. Use a long password.
- The Vercel path is untested.
- Not built yet from the plan: "add app" button, "save to `CLAUDE.md`" button, run history.

## 9. Things that expire or can stop working

| What | Where it lives | Expires | Symptom | Fix |
|---|---|---|---|---|
| **GitHub token** (`GITHUB_TOKEN`) | `.env.local`, and Vercel if deployed | On the date you chose when generating it | Red banner "GitHub: Bad credentials" on every action | Regenerate (6.2), replace the value, restart the dashboard |
| **GitHub token repository list** | Token settings on GitHub | Never, but new apps are not included | "GitHub: Not Found" for a newly added app | Edit the token and add the repo |
| **Anthropic API key** (`ANTHROPIC_API_KEY`) | Secret in each app repo | No automatic expiry; stops if deleted or disabled in the console | Run fails at "Answer the question" or "Make the change" | Create a new key at console.anthropic.com, update the repo secret |
| **Anthropic credits** | console.anthropic.com → Billing | Prepaid credits run out, and expire some time after purchase (check the console) | Same run failure, with a billing error in the run log | Add credits or enable auto-reload |
| **Dashboard login** | Browser cookie | 30 days; immediately if `DASHBOARD_PASSWORD` changes | Sent back to the login page | Log in again |
| **Ask answer artifact** | GitHub Actions | 1 day | Old answers cannot be fetched again | Ask again |
| **Per-run Actions token** | Created by GitHub for each run | End of the run | None | Nothing to do |
| **Netlify ↔ GitHub connection** | Netlify site settings | Never, but can be revoked or lose repo access | Preview stays on "Building preview" | Reconnect the repo in Netlify |
| **Netlify build allowance** | Netlify plan | Monthly | Builds stop; preview never becomes ready | Wait for the reset or upgrade |
| **Firebase authorized domain** | Firebase console | Never | Google sign-in fails in the preview if the entry is removed or the site is renamed | Re-add the domain (6.6) |
| **"Allow Actions to create pull requests"** | App repo settings | Never, but can be switched off | Run fails at the last step; branch pushed, no pull request | Tick it again (6.4) |
| **Central workflow reference** | `agent.yml` in each app repo | Breaks if `apps-manager` is renamed, made private, or `main` is renamed | Run fails immediately with "workflow not found" | Fix the `uses:` line or the repo visibility |

Only two of these have a real calendar date: the GitHub token and the Anthropic credits.
Put the token's expiry date in your calendar.
