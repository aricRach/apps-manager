import { notFound } from "next/navigation";
import { getApp } from "@/config/apps";
import { Workspace } from "@/components/workspace/workspace";

export default async function AppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) notFound();

  return <Workspace app={app} />;
}
