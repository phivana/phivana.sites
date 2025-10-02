'use client';

import * as React from 'react';
import { SiteRuntimeProvider } from '@phivana/site-components/runtime/SiteRuntimeContext';

export function SiteRuntimeBridge({
  children,
  eventId,
  apiBasePath = '/api',
  isSignedIn = false,
  onRsvpSuccessRedirectTo = '/thank-you',
}: {
  children: React.ReactNode;
  eventId?: string;
  apiBasePath?: string;
  isSignedIn?: boolean;
  onRsvpSuccessRedirectTo?: string;
}) {
  return (
    <SiteRuntimeProvider
      value={{
        eventId,
        apiBasePath,
        isSignedIn,
        onRsvpSuccessRedirectTo,
        // CountrySelectComponent: CountrySelect, // <— optional inject later
      }}
    >
      {children}
    </SiteRuntimeProvider>
  );
}
