import { headers as nextHeaders } from "next/headers";
import { mongo } from "@/lib/db";
import type { Snapshot } from "@/lib/types";
import { renderBlocks } from "@/lib/blocks";

export const runtime = "nodejs";       // ensure Node (Mongo available)
export const dynamic = "force-dynamic";

type Params = { slug?: string[] };
type SearchParams = Record<string, string | string[] | undefined>;

export default async function SitePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  // In newer Next, headers() can be async-typed: await it
  const hdrs = await nextHeaders();

  // Prefer the header we set in middleware
  let host =
    hdrs.get("x-request-host") ??
    hdrs.get("x-forwarded-host") ??
    hdrs.get("host") ??
    "";

  // Sanitize (strip ports and proxy lists)
  host = host.split(",")[0].trim().replace(/:\d+$/, "");

  // Dev override ?__host=... when running on localhost without DNS
  const devHostParam =
    typeof searchParams?.__host === "string" ? (searchParams?.__host as string) : undefined;
  if (devHostParam && host.includes("localhost")) {
    host = devHostParam;
  }

  const path = "/" + (params.slug?.join("/") ?? "");

  const db = await mongo();

  // Resolve siteId by host (matches either previewDomain "slug.phivana.site" or primaryDomain)
  const site = await db.collection("sites").findOne(
    { $or: [{ previewDomain: host }, { primaryDomain: host }] },
    { projection: { _id: 1 } }
  );

  const siteId = site?._id?.toString();
  if (!siteId) {
    return (
      <main style={{ padding: 24 }}>
        Unknown host <code>{host || "(empty host)"}</code>. Make sure the site exists and is
        published for this domain.
      </main>
    );
  }

  // Load latest snapshot for this site
  const snap = (await db
    .collection("snapshots")
    .find({ siteId })
    .sort({ createdAt: -1 })
    .limit(1)
    .next()) as Snapshot | null;

  if (!snap) {
    return <main style={{ padding: 24 }}>Not published yet.</main>;
  }

  const page =
    snap.pages.find((p) => p.path === path) ?? snap.pages.find((p) => p.path === "/");

  if (!page) {
    return (
      <main style={{ padding: 24 }}>
        Page not found for path <code>{path}</code>.
      </main>
    );
  }

  return <main>{renderBlocks(page.blocks)}</main>;
}
