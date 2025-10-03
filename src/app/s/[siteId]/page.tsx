// apps/renderer/src/app/s/[siteId]/page.tsx

import { getSite } from "@/src/lib/sites";
import RenderPage from "@/src/components/render/page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params; // ✅ Next 15 requires await
  const site = getSite(siteId);

  if (!site) {
    return (
      <div className="p-6">
        <h1 className="text-lg font-semibold">Site not found</h1>
        <p className="text-sm opacity-80">
          The renderer stores sites in memory (dev). Publish again or check{" "}
          <code>/api/debug/sites</code>.
        </p>
      </div>
    );
  }
  return <RenderPage site={site} />;
}
