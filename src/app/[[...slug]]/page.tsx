import { headers } from "next/headers";
import RenderPage from "@/src/components/render/page";
import { getSiteByHost, getSite } from "@/src/lib/sites";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function pickOne(v?: string | string[]) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SitePage(props: { searchParams: Promise<SearchParams> }) {
  // In Next 15, searchParams is a Promise in server components
  const sp = (await props.searchParams) ?? {};
  const hdrs = await headers();

  let host =
    hdrs.get("x-request-host") ??
    hdrs.get("x-forwarded-host") ??
    hdrs.get("host") ??
    "";
  host = host.split(",")[0].trim().replace(/:\d+$/, "");

  // 1) Try host mapping (populated on publish or via ?__host + middleware)
  const byHost = getSiteByHost(host);
  if (byHost) return <RenderPage site={byHost} />;

  // 2) Dev helpers:
  //    - ?__site=<siteId>  → force a specific siteId from the in-memory store
  //    - ?__host=<host>    → (extra fallback) try host mapping directly
  const devSiteId = pickOne(sp.__site);
  if (devSiteId) {
    const byId = getSite(devSiteId);
    if (byId) return <RenderPage site={byId} />;
  }

  const devHost = pickOne(sp.__host);
  if (devHost) {
    const byDevHost = getSiteByHost(devHost);
    if (byDevHost) return <RenderPage site={byDevHost} />;
  }

  return (
    <main style={{ padding: 24 }}>
      Unknown host <code>{host || "(empty host)"}</code>.
      <br />
      Publish with domains/slugs or open <code>/s/[siteId]</code>. For dev, use{" "}
      <code>/?__host=&lt;host&gt;</code> or <code>/?__site=&lt;siteId&gt;</code>.
    </main>
  );
}
