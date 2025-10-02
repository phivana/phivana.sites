// apps/renderer/src/lib/sites.ts

type StoredSite = any & { eventId?: string };

const SITES = new Map<string, StoredSite>();      // siteId -> site
const HOSTS = new Map<string, string>();          // host   -> siteId

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
  const siteId = HOSTS.get((host || '').toLowerCase());
  return siteId ? getSite(siteId) : undefined;
}
