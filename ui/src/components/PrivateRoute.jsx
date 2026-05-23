import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userPool } from '../hooks/useAuth';

export default function PrivateRoute() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'auth' | 'unauth'

  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (!user) { setStatus('unauth'); return; }
    user.getSession((err, session) => {
      setStatus(session?.isValid() && !err ? 'auth' : 'unauth');
    });
  }, []);

  if (status === 'checking') return null;
  return status === 'auth' ? <Outlet /> : <Navigate to="/login" replace />;
}
