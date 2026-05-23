import { userPool } from '../hooks/useAuth';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

/** Gets a fresh access token from the Cognito SDK (auto-refreshes if needed). */
const getAccessToken = () =>
  new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    if (!user) { resolve(null); return; }
    user.getSession((err, session) => {
      resolve(session?.isValid() && !err ? session.getAccessToken().getJwtToken() : null);
    });
  });

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
  if (!res.ok) throw await res.json();
  return res.json();
};

export const api = {
  users: {
    me: () => request('/users/me'),
  },
};
