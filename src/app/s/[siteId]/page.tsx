import { getSite } from "@/src/lib/sites";
import RenderPage from "@/src/components/render/page";

export default async function SitePage({ params }: { params: { siteId: string } }) {
  // Server component: read store and pass to client renderer
  const site = getSite(params.siteId);
  if (!site) return <div className="p-6">Site not found or not yet published.</div>;
  return <RenderPage site={site} />;
}
