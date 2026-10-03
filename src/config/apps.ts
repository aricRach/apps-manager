export type Platform = "vercel" | "netlify";

export interface AppConfig {
  /** URL slug used in the dashboard */
  id: string;
  name: string;
  /** GitHub repo as "owner/name" */
  repo: string;
  platform: Platform;
  productionUrl: string;
  defaultBranch: string;
  /** Caller workflow file in the app repo (see templates/caller-workflow.yml) */
  workflowFile: string;
  /** Netlify site name, used to build deploy-preview URLs */
  netlifySite?: string;
  notes?: string;
}

// Registry of managed apps. Replace the placeholder values with the real repos.
export const apps: AppConfig[] = [
  {
    id: "football",
    name: "Football",
    repo: "aricRach/Teams",
    platform: "netlify",
    productionUrl: "https://teams-rach.netlify.app",
    defaultBranch: "master",
    workflowFile: "agent.yml",
    notes: "MVP app. Preview runs against the production database.",
    netlifySite: "teams-rach"
  },
];

export function getApp(id: string): AppConfig | undefined {
  return apps.find((app) => app.id === id);
}
