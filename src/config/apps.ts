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
  /** Netlify site name, used to build the branch-deploy preview URL */
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
  {
    id: "recipes",
    name: "Recipes",
    repo: "aricRach/Recipes",
    platform: "netlify",
    productionUrl: "https://rach-recipes.netlify.app",
    defaultBranch: "master",
    workflowFile: "agent.yml",
    netlifySite: "rach-recipes"
  },
  {
    id: "acl-rehab",
    name: "ACL Rehab",
    repo: "aricRach/ACL-Rehab",
    platform: "netlify",
    productionUrl: "https://acl-rehab-rach.netlify.app",
    defaultBranch: "master",
    workflowFile: "agent.yml",
    netlifySite: "acl-rehab-rach"
  },
  {
    id: "interview-prep",
    name: "Interview Prep",
    repo: "aricRach/interview-prep",
    platform: "netlify",
    productionUrl: "https://rach-interviews.netlify.app",
    defaultBranch: "main",
    workflowFile: "agent.yml",
    netlifySite: "rach-interviews"
  },
  {
    id: "apps-manager",
    name: "Apps Manager",
    repo: "aricRach/apps-manager",
    platform: "vercel",
    productionUrl: "https://rach-apps-manager.vercel.app",
    defaultBranch: "main",
    workflowFile: "agent.yml",
    notes: "This dashboard. Approving a change redeploys it.",
  },
];

export function getApp(id: string): AppConfig | undefined {
  return apps.find((app) => app.id === id);
}
