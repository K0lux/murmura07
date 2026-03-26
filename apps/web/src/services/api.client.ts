export type MurmuraApiError = {
  message: string;
  status?: number;
};

type ApiEnvelope<T> = {
  requestId: string | null;
  timestamp: string;
  data: T;
};

type StoredSession = {
  accessToken?: string;
  refreshToken?: string;
};

const authStorageKey = 'murmura.web.auth';

function readStoredSession(): StoredSession | null {
  const rawSession = window.localStorage.getItem(authStorageKey);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as StoredSession;
  } catch {
    window.localStorage.removeItem(authStorageKey);
    return null;
  }
}

function buildHeaders(init?: RequestInit, accessToken?: string | null) {
  const headers = new Headers(init?.headers);

  if (!headers.has('Content-Type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
}

async function parseResponse<T>(response: Response, path: string): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { message?: string }
    | null;

  if (!response.ok) {
    throw {
      message:
        payload && typeof payload === 'object' && 'message' in payload && payload.message
          ? payload.message
          : `Request failed for ${path}`,
      status: response.status
    } satisfies MurmuraApiError;
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}

let refreshRequest: Promise<string | null> | null = null;

async function refreshAccessToken(baseUrl: string): Promise<string | null> {
  if (refreshRequest) {
    return refreshRequest;
  }

  refreshRequest = (async () => {
    const session = readStoredSession();
    const refreshToken = session?.refreshToken;

    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      window.localStorage.removeItem(authStorageKey);
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | ApiEnvelope<{ accessToken: string; refreshToken: string }>
      | null;

    const nextTokens = payload?.data;
    if (!nextTokens?.accessToken || !nextTokens.refreshToken) {
      window.localStorage.removeItem(authStorageKey);
      return null;
    }

    const nextSession = {
      ...(session ?? {}),
      accessToken: nextTokens.accessToken,
      refreshToken: nextTokens.refreshToken
    };

    window.localStorage.setItem(authStorageKey, JSON.stringify(nextSession));
    return nextTokens.accessToken;
  })();

  try {
    return await refreshRequest;
  } finally {
    refreshRequest = null;
  }
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const session = readStoredSession();

  const send = async (accessToken?: string | null) =>
    fetch(`${baseUrl}${path}`, {
      ...init,
      headers: buildHeaders(init, accessToken)
    });

  let response = await send(session?.accessToken ?? null);

  if (response.status === 401 && !path.startsWith('/auth/')) {
    const nextAccessToken = await refreshAccessToken(baseUrl);

    if (nextAccessToken) {
      response = await send(nextAccessToken);
    }
  }

  return parseResponse<T>(response, path);
}
