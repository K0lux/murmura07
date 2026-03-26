type WaitlistAnalyticsEvent = {
  status: 'success' | 'error';
  email: string;
  organization: string;
  message?: string;
};

const analyticsEndpoint = import.meta.env.VITE_WAITLIST_ANALYTICS_ENDPOINT?.trim();

export function trackWaitlistSubmission(event: WaitlistAnalyticsEvent) {
  if (!analyticsEndpoint) {
    return;
  }

  const payload = JSON.stringify({
    ...event,
    source: 'murmura-landing-page',
    occurredAt: new Date().toISOString()
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(analyticsEndpoint, new Blob([payload], { type: 'application/json' }));
    return;
  }

  void fetch(analyticsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload,
    keepalive: true
  }).catch(() => undefined);
}
