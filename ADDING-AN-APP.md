# Adding an app to Apps Manager

About 15 minutes. Six steps, then a test. Background and architecture are in `TECH-DESIGN.md`.

These steps are for an app hosted on **Netlify**, which is the tested path. For an app on
Vercel, steps 4 to 6 are different: follow [Vercel apps](#vercel-apps) for those.

## Before you start, collect these

| Value | Where to find it | Example (Football) |
|---|---|---|
| Repo | GitHub URL | `aricRach/Teams` |
| Default branch | Repo main page, branch dropdown | `master` |
| Netlify site name | The part before `.netlify.app` | `teams-rach` |
| Production URL | Netlify site overview | `https://teams-rach.netlify.app` |
| Login provider | The app's code or config | Firebase (`rach-teams`) |

Your preview address will be `agent-preview--<netlify site name>.netlify.app`. You need it in steps 4 and 5.

---

## Step 1: Give the GitHub token access to the repo

1. GitHub → avatar → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. Open the existing Apps Manager token → **Edit**.
3. Under Repository access, add the new repo. Save.

No need to regenerate the token or change `.env.local`.

## Step 2: Add the workflow to the app repo

1. Open the repo on GitHub and make sure you are on its **default branch**.
2. Add file → Create new file → name it `.github/workflows/agent.yml`.
3. Paste the contents of `templates/caller-workflow.yml` from this repo, unchanged. Commit.

## Step 3: Two settings in the app repo

1. Settings → Secrets and variables → Actions → New repository secret:
   name `ANTHROPIC_API_KEY`, value: your Anthropic key (the same key as other apps is fine).
2. Settings → Actions → General → Workflow permissions →
   tick **Allow GitHub Actions to create and approve pull requests** → Save.

## Step 4: Netlify

1. The site must be connected to the GitHub repo (Site configuration → Build & deploy → Continuous deployment).
2. Branches and deploy contexts → **Branch deploys** → All, or add `agent-preview`.
3. Environment variables: check that the ones production needs are also available to branch deploys (the "Branch deploys" context, or "All deploy contexts").

## Step 5: Allow login on the preview address

Skip this step if the app has no login.

- **Firebase:** console → the app's project → Authentication → Settings → Authorized domains →
  Add domain → `agent-preview--<site>.netlify.app` (no `https://`).
- **Supabase:** dashboard → Authentication → URL Configuration → Redirect URLs →
  add `https://agent-preview--<site>.netlify.app/**`.

## Step 6: Register the app in the dashboard

Add an entry to the `apps` array in `src/config/apps.ts`:

```ts
{
  id: "my-app",                 // lowercase, no spaces; used in the dashboard URL
  name: "My App",               // shown in the sidebar
  repo: "aricRach/my-app",
  platform: "netlify",
  productionUrl: "https://my-app.netlify.app",
  defaultBranch: "main",        // the real one, checked above
  workflowFile: "agent.yml",
  netlifySite: "my-app",
  notes: "Optional one-line note shown in the apps list.",
},
```

Restart `npm run dev`. The app appears in the sidebar. If the dashboard is deployed, commit
and push this change so it redeploys.

---

## Test it

1. **Ask** something simple ("what does this app do?"). An answer within about two minutes proves steps 1 to 3 and 6.
2. **Change** something tiny ("add a period to the page title"). The preview loading proves step 4.
3. **Log in** inside the preview. That proves step 5.
4. **Discard** the test change.

## If something goes wrong

| What you see | Likely cause | Fix |
|---|---|---|
| "GitHub: Not Found" | Token has no access to the repo, or the repo name is misspelled | Step 1, or check `repo` in step 6 |
| "The workflow run never started" | `agent.yml` missing, or not on the default branch, or `defaultBranch` is wrong | Step 2, or check `defaultBranch` in step 6 |
| Run fails at "Answer the question" / "Make the change" | `ANTHROPIC_API_KEY` missing or out of credits | Step 3.1; check billing at console.anthropic.com |
| Run fails at the last step, no pull request | The pull-request setting is off | Step 3.2 |
| Stuck on "Building preview" | `netlifySite` missing or wrong, or the site is not connected to the repo | Step 6, step 4.1 |
| Preview shows Netlify "Site not found" | Branch deploys are off | Step 4.2 |
| Preview loads but the app is broken or empty | Environment variables missing for branch deploys | Step 4.3 |
| Preview area is blank | The app blocks embedding | Remove `X-Frame-Options` / `frame-ancestors` from the app's headers (`netlify.toml` or `_headers`), or use the open-in-new-tab button |
| Login fails in the preview | Preview address not allowed | Step 5 |
| Vercel: preview asks for a Vercel login, or the preview area is blank | Deployment Protection is on for previews | Vercel step 4.2 |
| Vercel: stuck on "Building preview" | The project is not connected to the repo, so no build starts | Vercel step 4.1 |
| Vercel: login page comes back after signing in, with no error | The app's login cookie is dropped inside the embedded preview | Vercel step 5, cookie login |

For any failed run, the **Run log** link in the dashboard's status card shows the exact error.

## Recommended: a `CLAUDE.md` in the app repo

The agent reads this file on every run. A short one makes its changes fit your code:

```md
# <App name>

- Stack: <framework, language, styling>
- Build: `npm run build`. Tests: `npm test`.
- Conventions: <naming, folder structure, things to always or never do>
- Never run database migrations or change the schema without asking first.
- The preview uses the production database. Do not add code that writes or deletes data on load.
```

## Vercel apps

Less tested than Netlify. The only Vercel app so far is Apps Manager itself (`apps-manager`
in `src/config/apps.ts`).

Steps 1 to 3 are the same as above. Replace steps 4 to 6 with these.

### Step 4 (Vercel): project settings

1. The project must be connected to the GitHub repo (Settings → Git). Vercel then builds
   every pushed branch on its own; there is no branch-deploy setting to turn on.
2. Settings → Deployment Protection → turn **Vercel Authentication** off for previews.
   While it is on, the preview asks for a Vercel login and cannot load inside the dashboard.
3. Settings → Environment Variables: every variable production needs must also have
   **Preview** ticked.

### Step 5 (Vercel): allow login on the preview address

Skip this step if the app has no login.

Vercel gives every build a new address, and the dashboard shows that one. So the preview
address changes with each change the agent makes.

- **Supabase:** dashboard → Authentication → URL Configuration → Redirect URLs →
  add a wildcard that covers all of the project's previews, such as
  `https://<project>-*-<vercel account>.vercel.app/**`.
- **Firebase:** not supported yet. Firebase needs one fixed domain, and the dashboard does
  not yet use Vercel's fixed branch address
  (`<project>-git-agent-preview-<vercel account>.vercel.app`). Until it does, open the
  preview with the open-in-new-tab button and expect login to fail.
- **Cookie login in the app's own code** (like Apps Manager's password): the browser drops
  a `SameSite=Lax` cookie inside the embedded preview, so signing in returns to the login
  page. On preview deployments set the cookie with `SameSite=None; Secure; Partitioned`,
  and reject API writes from other origins. See `src/lib/auth.ts` and `src/middleware.ts`
  in this repo.

### Step 6 (Vercel): register the app

Same as step 6 above, with `platform: "vercel"` and no `netlifySite`:

```ts
{
  id: "my-app",
  name: "My App",
  repo: "aricRach/my-app",
  platform: "vercel",
  productionUrl: "https://my-app.vercel.app",
  defaultBranch: "main",
  workflowFile: "agent.yml",
},
```

Then run the same four tests from [Test it](#test-it).
