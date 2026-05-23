import { userPool } from '../hooks/useAuth';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const getSession = () =>
  new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    if (!user) { resolve(null); return; }
    user.getSession((err, session) => resolve(!err && session?.isValid() ? session : null));
  });

/** Gets a fresh access token from the Cognito SDK (auto-refreshes if needed). */
const getAccessToken = async () => {
  const session = await getSession();
  return session?.getAccessToken().getJwtToken() ?? null;
};

/** Returns decoded ID token payload (has email, name, sub). */
export const getIdTokenPayload = async () => {
  const session = await getSession();
  return session?.getIdToken().decodePayload() ?? null;
};

const request = async (path, options = {}) => {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    err._status = res.status;
    throw err;
  }
  return res.json();
};

export const api = {
  auth: {
    provision: (name, email) => request('/auth/provision', { method: 'POST', body: { name, email } }),
  },
  users: {
    me: () => request('/users/me'),
  },
};
