import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function DashboardPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.users.me()
      .then(setUser)
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Signed in as: {user.id} — role: {user.role}</p>}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
