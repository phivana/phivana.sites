import type { SiteDoc } from "@phivana/site-builder";

type StoredSite = SiteDoc & { eventId?: string };

declare global {
  // Keep state across hot reloads in dev (Next dev server)
  // eslint-disable-next-line no-var
  var __PHV_SITES__: Map<string, StoredSite> | undefined; // siteId -> site
  // eslint-disable-next-line no-var
  var __PHV_HOSTS__: Map<string, string> | undefined;      // host   -> siteId
  // eslint-disable-next-line no-var
  var __PHV_SLUGS__: Map<string, string> | undefined;      // slug   -> siteId
}

const SITES = globalThis.__PHV_SITES__ ?? (globalThis.__PHV_SITES__ = new Map());
const HOSTS = globalThis.__PHV_HOSTS__ ?? (globalThis.__PHV_HOSTS__ = new Map());
const SLUGS = globalThis.__PHV_SLUGS__ ?? (globalThis.__PHV_SLUGS__ = new Map());

/** Store/replace a site snapshot by siteId (projectId). */
export function putSite(siteId: string, site: StoredSite) {
  SITES.set(siteId, site);
}

/** Read a site by siteId. */
export function getSite(siteId: string) {
  return SITES.get(siteId);
}

/** Map a host (domain) to a siteId for host-based rendering. */
export function mapHostToSite(host: string, siteId: string) {
  if (!host) return;
  HOSTS.set(host.toLowerCase(), siteId);
}

/** Resolve a site by host (domain). */
export function getSiteByHost(host: string) {
  const siteId = HOSTS.get((host || "").toLowerCase());
  return siteId ? getSite(siteId) : undefined;
}

/** Map a slug to a siteId (for slugged previews and to compute host). */
export function mapSlugToSite(slug: string, siteId: string) {
  if (!slug) return;
  SLUGS.set(slug.toLowerCase(), siteId);
}

/** Resolve a site by slug. */
export function getSiteBySlug(slug: string) {
  const siteId = SLUGS.get((slug || "").toLowerCase());
  return siteId ? getSite(siteId) : undefined;
}

/** Resolve *only* the siteId by slug (used to ensure slug uniqueness per site). */
export function getSiteIdBySlug(slug: string): string | undefined {
  return SLUGS.get((slug || "").toLowerCase());
}

/** For debug routes. */
export function listSiteIds(): string[] {
  return Array.from(SITES.keys());
}

export function listDomainMap(): Array<{ host: string; siteId: string }> {
  return Array.from(HOSTS.entries()).map(([host, siteId]) => ({ host, siteId }));
}

export function listSlugMap(): Array<{ slug: string; siteId: string }> {
  return Array.from(SLUGS.entries()).map(([slug, siteId]) => ({ slug, siteId }));
}
