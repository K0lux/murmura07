import { apiClient } from './api.client';

export async function login(email: string, password: string) {
  return apiClient<{ accessToken: string; refreshToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function logout(refreshToken: string) {
  return apiClient<{ loggedOut: boolean }>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
}

export async function register(payload: {
  email: string;
  password: string;
  firstName?: string;
  preferredCommunicationStyle?: string;
}) {
  return apiClient<{ id: string; email: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function refreshToken(refreshTokenValue: string) {
  return apiClient<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refreshTokenValue })
  });
}
