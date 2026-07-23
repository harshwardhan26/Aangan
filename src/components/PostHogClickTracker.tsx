'use client';

import React from 'react';
import posthog from 'posthog-js';

type PostHogClickTrackerProps = {
  eventName: string;
  properties?: Record<string, any>;
  children: React.ReactNode;
};

export default function PostHogClickTracker({ eventName, properties, children }: PostHogClickTrackerProps) {
  const handleClick = (e: React.MouseEvent) => {
    posthog.capture(eventName, properties);
  };

  return (
    <div onClick={handleClick} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}
