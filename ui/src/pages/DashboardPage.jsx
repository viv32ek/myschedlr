import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api, getIdTokenPayload } from '../services/api';

export default function DashboardPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await api.users.me();
        setUser(me);
      } catch (err) {
        if (err._status === 404) {
          // First login — provision the profile from the Cognito ID token then retry
          const payload = await getIdTokenPayload();
          if (!payload) { navigate('/login'); return; }
          await api.auth.provision(payload.name ?? payload.email, payload.email);
          const me = await api.users.me();
          setUser(me);
        } else {
          navigate('/login');
        }
      }
    };
    load();
  }, [navigate]);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Signed in as: {user.email} — roles: {user.roles?.join(', ')}</p>}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
