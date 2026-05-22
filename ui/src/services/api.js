const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const request = async (path, options = {}) => {
  const token = localStorage.getItem('accessToken');
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
  auth: {
    signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
    login: (data) => request('/auth/login', { method: 'POST', body: data }),
  },
  users: {
    me: () => request('/users/me'),
  },
};
