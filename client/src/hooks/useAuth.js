import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) return;
    try { const d = jwtDecode(t); setUser({ id: d.id, email: d.email }); } catch {}
  }, []);
  return { user, setUser };
};
