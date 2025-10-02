// apps/renderer/src/components/render/page.tsx
'use client';

import * as React from 'react';
import { PageRenderer, type SiteDoc } from '@phivana/site-builder';
import { SiteRuntimeProvider } from '@phivana/site-components/runtime/SiteRuntimeContext';

// If you want the site to POST directly to apps/api:
// set NEXT_PUBLIC_API_ORIGIN=https://api.your-host.tld
const PUBLIC_API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || '';

export default function RenderPage({ site }: { site: SiteDoc }) {
  const page = site.pages?.[0];
  if (!page) return <div className="p-6">No page</div>;

  // Decide where blocks (e.g. SectionRSVP) should POST to.
  // Option A (recommended): public origin → SectionRSVP posts to https://api…/api/rsvp
  // Option B: leave blank and add a proxy route in renderer (/api/rsvp) → see Section 6.
  const apiBasePath = PUBLIC_API_ORIGIN ? `${PUBLIC_API_ORIGIN}/api` : '/api';

  return (
    <SiteRuntimeProvider
      value={{
        eventId: site.eventId,               // blocks need this
        apiBasePath,                         // where to POST
        isSignedIn: false,                   // wire your auth if needed
        onRsvpSuccessRedirectTo: '/thank-you',
        // CountrySelectComponent: CountrySelect, // optional injection
      }}
    >
      <div className="min-h-screen bg-background text-foreground">
        <header className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-semibold">
            {site.meta?.title ?? 'My Site'}
          </h1>
        </header>
        <main>
          <PageRenderer page={page} />
        </main>
        <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} — Powered by PHIVANA
        </footer>
      </div>
    </SiteRuntimeProvider>
  );
}
