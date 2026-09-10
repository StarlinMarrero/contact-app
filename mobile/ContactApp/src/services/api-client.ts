import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 4000;
const REQUEST_TIMEOUT_MS = 15_000;

function resolveApiUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const devServerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (devServerHost) return `http://${devServerHost}:${API_PORT}`;

  return Platform.OS === 'android' ? `http://10.0.2.2:${API_PORT}` : `http://localhost:${API_PORT}`;
}

export const API_URL = resolveApiUrl();

export type ApiFieldErrors = Record<string, string[] | undefined>;

export class ApiError extends Error {
  readonly status: number;
  readonly details?: ApiFieldErrors;

  constructor(message: string, status: number, details?: ApiFieldErrors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    throw new ApiError(
      timedOut
        ? 'The server took too long to respond. Please try again.'
        : "We couldn't reach the server. Check your connection and try again.",
      0,
    );
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data?.error;
    throw new ApiError(
      error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      error?.details,
    );
  }

  if (data === null) {
    throw new ApiError('Unexpected response from the server. Please try again.', response.status);
  }

  return data as T;
}
