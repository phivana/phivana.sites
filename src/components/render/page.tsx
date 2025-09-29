"use client";

import * as React from "react";
import { PageRenderer } from "@phivana/site-builder";
import { SiteDoc } from "@phivana/site-builder";

export default function RenderPage({ site }: { site: SiteDoc }) {
  const page = site.pages[0];
  if (!page) return <div>No page</div>;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">{site.meta?.title ?? "My Site"}</h1>
      </header>
      <main>
        <PageRenderer page={page} />
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} — Powered by PHIVANA
      </footer>
    </div>
  );
}
