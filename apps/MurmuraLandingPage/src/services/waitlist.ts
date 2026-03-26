export type WaitlistPayload = {
  email: string;
  organization: string;
};

type WaitlistProvider = 'generic' | 'google-apps-script';

const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT?.trim();
const provider = (import.meta.env.VITE_WAITLIST_PROVIDER?.trim() || 'generic') as WaitlistProvider;

function assertConfigured() {
  if (!endpoint) {
    throw new Error(
      "VITE_WAITLIST_ENDPOINT n'est pas configure. Configurez un endpoint HTTP ou un Google Apps Script web app."
    );
  }
}

function buildRequest(payload: WaitlistPayload) {
  const body = JSON.stringify({
    email: payload.email,
    organization: payload.organization,
    source: 'murmura-landing-page',
    submittedAt: new Date().toISOString()
  });

  if (provider === 'google-apps-script') {
    return {
      url: endpoint!,
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body
      }
    };
  }

  return {
    url: endpoint!,
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }
  };
}

export async function submitWaitlist(payload: WaitlistPayload) {
  assertConfigured();

  const request = buildRequest(payload);
  const response = await fetch(request.url, request.init);

  if (!response.ok) {
    throw new Error("L'inscription a la waitlist a echoue.");
  }
}
