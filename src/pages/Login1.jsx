//src/pages/Login1.jsx


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Login.css';
import BoutonRetour from '../components/BoutonRetour';


// ... dans ton JSX :
<BoutonRetour />


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email est requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Format d\'email invalide.';
    }
    if (!form.password || form.password.trim() === '') {
      errs.password = 'Mot de passe est requis.';
    } else if (form.password.length < 6) {
      errs.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // 🔍 Vérification console pour debug
    console.log("Tentative login avec :", form);

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || 'Erreur serveur.');
        return;
      }

      // ✅ Stockage des données
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('prenom', data.user.prenom);

      // ✅ Redirection selon le rôle
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employe/dashboard');
      }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      setApiError('Erreur réseau.');
    }
  };

  return (
    <main className="login-container" aria-label="Page de connexion">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h1>Connexion</h1>

        {apiError && <p className="error">{apiError}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
          placeholder="exemple@delight.com"
          required
          autoComplete="email"
        />
        {errors.email && <span id="email-error" className="error">{errors.email}</span>}

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          aria-describedby={errors.password ? 'password-error' : undefined}
          aria-invalid={!!errors.password}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        {errors.password && <span id="password-error" className="error">{errors.password}</span>}

        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
};

export default Login;
