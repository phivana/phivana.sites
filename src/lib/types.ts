export type Block = { id: string; type: "hero"; props: Record<string, any> };
export type Page = { _id: string; siteId: string; path: string; blocks: Block[] };
export type Snapshot = { _id: string; siteId: string; createdAt: Date; pages: Page[]; theme: Record<string, any> };
