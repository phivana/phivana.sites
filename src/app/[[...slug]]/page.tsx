// apps/renderer/src/app/[[...slug]]/page.tsx
import { headers } from 'next/headers';
import RenderPage from '@/src/components/render/page';
import { getSiteByHost, getSite } from '@/src/lib/sites';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SitePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const hdrs = await headers();

  let host =
    hdrs.get('x-request-host') ??
    hdrs.get('x-forwarded-host') ??
    hdrs.get('host') ??
    '';
  host = host.split(',')[0].trim().replace(/:\d+$/, '');

  // Resolve by domain mapping (created during /api/publish)
  const byHost = getSiteByHost(host);
  if (byHost) return <RenderPage site={byHost} />;

  // Dev fallback: ?__site=<siteId>
  const devSiteId =
    typeof searchParams?.__site === 'string'
      ? (searchParams?.__site as string)
      : undefined;
  if (devSiteId) {
    const byId = getSite(devSiteId);
    if (byId) return <RenderPage site={byId} />;
  }

  return (
    <main style={{ padding: 24 }}>
      Unknown host <code>{host || '(empty host)'}</code>.<br />
      Publish with domains or open <code>/s/[siteId]</code>.
    </main>
  );
}
