import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Login.css';


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);


  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email est requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Format d\'email invalide.';
    }
    if (!form.password || form.password.trim() === '') {
      errs.password = 'Mot de passe requis.';
    } else if (form.password.length < 6) {
      errs.password = 'Minimum 6 caractères.';
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


    const recaptchaToken = window.grecaptcha?.getResponse();
    if (!recaptchaToken) {
      setApiError("Veuillez cocher le reCAPTCHA.");
      return;
    }


    try {
      // ✅ Récupération du CSRF token
      const csrfRes = await fetch('http://localhost:3000/api/csrf-token', {
        credentials: 'include',
      });
      const csrfData = await csrfRes.json();


      // 🔐 Envoi des identifiants avec CSRF et reCAPTCHA
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfData.csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          mot_de_passe: form.password,
          recaptchaToken
        })
        
      });


      const data = await res.json();


      if (!res.ok) {
        setApiError(data.message || 'Erreur serveur.');
        return;
      }


      localStorage.setItem('role', data.user.role);
      localStorage.setItem('prenom', data.user.prenom);
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/employe/dashboard');


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


        <div
          className="g-recaptcha"
          data-sitekey="6Lf4dosrAAAAAFTGUzeyKtbrKE9OW7WTobBfyK42"
          ref={recaptchaRef}
        ></div>


        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
};


export default Login;

