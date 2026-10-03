import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { apps } from "@/config/apps";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

const platformLabel = { vercel: "Vercel", netlify: "Netlify" };

export default function AppsPage() {
  return (
    <>
      <PageHeader
        title="Apps"
        description="Pick an app to change it, ask about it, or review a pending change."
      />
      <div className="px-4 pb-6 sm:px-6">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary text-left text-xs font-medium uppercase tracking-wide text-fg-muted">
                <th className="px-4 py-3">App</th>
                <th className="hidden px-4 py-3 sm:table-cell">Repository</th>
                <th className="px-4 py-3">Platform</th>
                <th className="hidden px-4 py-3 md:table-cell">Production</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-border transition-colors duration-75 last:border-0 hover:bg-bg-hover"
                >
                  <td className="px-4 py-3">
                    <Link href={`/apps/${app.id}`} className="font-medium text-fg-primary">
                      {app.name}
                    </Link>
                    {app.notes && <p className="text-xs text-fg-muted">{app.notes}</p>}
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-fg-secondary sm:table-cell">
                    {app.repo}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={platformLabel[app.platform]} variant="neutral" dot={false} />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <a
                      href={app.productionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-fg-secondary transition-colors duration-75 hover:text-accent"
                    >
                      {app.productionUrl.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/apps/${app.id}`}
                      className="inline-flex items-center gap-1.5 font-medium text-accent transition-colors duration-75 hover:text-accent-hover"
                    >
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
