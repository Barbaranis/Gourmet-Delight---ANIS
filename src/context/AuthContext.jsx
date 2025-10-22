import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';


const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);   // { id, email, role, prenom }
  const [token, setToken]   = useState(null);   // valeur "sentinelle" car le JWT est en cookie httpOnly
  const [loading, setLoading] = useState(true);


  // ↻ Récupère l'utilisateur côté serveur via le cookie httpOnly
  const refreshMe = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
      if (r.ok) {
        const data = await r.json(); // attendu: { user: {...} }
        setUser(data.user || data);
        setToken('cookie'); // on ne lit pas le JWT, on marque juste “authentifié”
      } else {
        setUser(null);
        setToken(null);
      }
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => { refreshMe(); }, [refreshMe]);


  // Appelé après un login réussi
  const login = (userData) => {
    setUser(userData);
    setToken('cookie');               // le vrai JWT reste en cookie httpOnly
    // Optionnel: garder un peu d'info en localStorage (jamais le token)
    localStorage.setItem('user', JSON.stringify(userData));
  };


  const logout = async () => {
    try { await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } catch {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
  };


  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);











