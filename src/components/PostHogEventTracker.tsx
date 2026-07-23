'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

type PostHogEventTrackerProps = {
  eventName: string;
  properties?: Record<string, any>;
};

export default function PostHogEventTracker({ eventName, properties }: PostHogEventTrackerProps) {
  useEffect(() => {
    posthog.capture(eventName, properties);
  }, [eventName, properties]);

  return null;
}
