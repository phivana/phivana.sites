import type { SiteDoc } from "@phivana/site-builder";

// 👇 export this so the route can import it
export type StoredSite = SiteDoc & { eventId?: string };

declare global {
  // eslint-disable-next-line no-var
  var __PHV_SITES__: Map<string, StoredSite> | undefined;
  // eslint-disable-next-line no-var
  var __PHV_HOSTS__: Map<string, string> | undefined;
  // eslint-disable-next-line no-var
  var __PHV_SLUGS__: Map<string, string> | undefined;
}

const SITES = globalThis.__PHV_SITES__ ?? (globalThis.__PHV_SITES__ = new Map());
const HOSTS = globalThis.__PHV_HOSTS__ ?? (globalThis.__PHV_HOSTS__ = new Map());
const SLUGS = globalThis.__PHV_SLUGS__ ?? (globalThis.__PHV_SLUGS__ = new Map());

export function putSite(siteId: string, site: StoredSite) {
  SITES.set(siteId, site);
}
export function getSite(siteId: string) {
  return SITES.get(siteId);
}
export function mapHostToSite(host: string, siteId: string) {
  if (!host) return;
  HOSTS.set(host.toLowerCase(), siteId);
}
export function getSiteByHost(host: string) {
  const siteId = HOSTS.get((host || "").toLowerCase());
  return siteId ? getSite(siteId) : undefined;
}
export function mapSlugToSite(slug: string, siteId: string) {
  if (!slug) return;
  SLUGS.set(slug.toLowerCase(), siteId);
}
export function getSiteBySlug(slug: string) {
  const siteId = SLUGS.get((slug || "").toLowerCase());
  return siteId ? getSite(siteId) : undefined;
}
export function getSiteIdBySlug(slug: string): string | undefined {
  return SLUGS.get((slug || "").toLowerCase());
}
export function listSiteIds(): string[] {
  return Array.from(SITES.keys());
}
export function listDomainMap(): Array<{ host: string; siteId: string }> {
  return Array.from(HOSTS.entries()).map(([host, siteId]) => ({ host, siteId }));
}
export function listSlugMap(): Array<{ slug: string; siteId: string }> {
  return Array.from(SLUGS.entries()).map(([slug, siteId]) => ({ slug, siteId }));
}
