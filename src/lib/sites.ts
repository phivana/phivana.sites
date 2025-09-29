// apps\renderer\src\lib\sites.ts

type SiteStore = Map<string, any>;

const SITES: SiteStore = new Map();

export function putSite(siteId: string, site: any) {
  SITES.set(siteId, site);
}

export function getSite(siteId: string) {
  return SITES.get(siteId);
}
