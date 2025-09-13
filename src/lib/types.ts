// Types for the public renderer (phivana.site)

// Example props for the "hero" block
export type HeroProps = {
  title?: string;
  subtitle?: string;
};

// Extend this union as you add more block types
export type Block =
  | { id: string; type: "hero"; props: HeroProps };

export type Page = {
  _id: string;        // renderer stores ObjectId as hex string
  siteId: string;     // foreign key (hex string)
  path: string;       // "/", "/rsvp", ...
  blocks: Block[];
};

export type Snapshot = {
  _id: string;        // renderer sees ObjectId as hex string
  siteId: string;     // hex string
  createdAt: Date;
  pages: Page[];
  theme: Record<string, unknown>; // avoid 'any'
};
