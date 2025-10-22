// src/pages/Login1.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Style/Login.css';
import { auth, signInWithEmailAndPassword } from '../firebaseClient';
import { useAuth } from '../context/AuthContext';


const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const IS_PROD = process.env.NODE_ENV === 'production';


// ------- util: fetch avec timeout (évite l’overlay “Timeout” en dev)
const fetchWithTimeout = async (url, options = {}, ms = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
};


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const recaptchaRef = useRef(null);


  // Auth context (met à jour l’état global après succès)
  const { login: ctxLogin, refreshMe } = useAuth();


  // Charger reCAPTCHA seulement en production
  useEffect(() => {
    if (IS_PROD && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);


  // -------- validation simple
  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email est requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Format d'email invalide.";
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
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setApiError('');
  };


  // -------- Firebase (non bloquant)
  const firebaseLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log('✅ Connecté à Firebase :', cred.user.email);
    } catch (err) {
      console.warn('⚠️ Firebase ignoré (non bloquant) :', err?.message);
    }
  };


  // -------- CSRF token
  const getCsrfToken = async () => {
    const res = await fetchWithTimeout(`${API}/api/csrf-token`, { credentials: 'include' }, 8000);
    if (!res.ok) throw new Error(`CSRF ${res.status}`);
    const data = await res.json();
    if (!data?.csrfToken) throw new Error('No CSRF token returned');
    return data.csrfToken;
  };


  // -------- submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');


    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }


    // reCAPTCHA : bypass en dev (token 'dev'), requis en prod
    let recaptchaToken = 'dev';
    if (IS_PROD) {
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha || grecaptcha.getResponse().length === 0) {
        setApiError('Veuillez cocher le reCAPTCHA.');
        return;
      }
      recaptchaToken = grecaptcha.getResponse();
    }


    try {
      setSubmitting(true);


      const csrfToken = await getCsrfToken();


      const res = await fetchWithTimeout(`${API}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // casse exacte
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,      // accepté par la route (normalisé en backend)
          mot_de_passe: form.password,  // compat ancien nom
          recaptchaToken,
        }),
      }, 12000);


      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }


      if (!res.ok) {
        console.error('❌ /login', res.status, data);
        setApiError(data?.message || `Erreur ${res.status} au login`);
        return;
      }


      // --- succès backend : synchro contexte + Firebase (non bloquant)
 
ctxLogin?.(data.user, 'cookie');  // ✅ marque “authentifié” (JWT est dans le cookie httpOnly)
refreshMe?.().catch(() => {});    // optionnel
firebaseLogin().catch(() => {});






      // (facultatif) pour d’autres composants non contextés
      localStorage.setItem('role', data.user.role || '');
      localStorage.setItem('prenom', data.user.prenom || '');
      localStorage.setItem('token', 'cookie');



      // Choix de redirection
      const from = location.state?.from?.pathname;
      const target = from || (data.user.role === 'admin' ? '/admin/dashboard' : '/employe/dashboard');


      console.log('➡️ redirect to:', target);
      // navigate + fallback infaillible
      try { navigate(target, { replace: true }); } catch {}
      setTimeout(() => {
        if (window.location.pathname !== target) window.location.assign(target);
      }, 60);
    } catch (error) {
      console.error('❌ Erreur de connexion :', error);
      setApiError(error.name === 'AbortError'
        ? 'La requête a expiré. Réessayez.'
        : 'Erreur réseau.');
    } finally {
      setSubmitting(false);
      if (IS_PROD && window.grecaptcha) window.grecaptcha.reset();
    }
  };


  return (
    <main className="login-container" aria-label="Page de connexion">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h1>Connexion</h1>


        {apiError && <p className="error" role="alert">{apiError}</p>}


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


        {/* reCAPTCHA rendu seulement en production */}
        {IS_PROD && (
          <div
            className="g-recaptcha"
            data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // clé de test v2 (OK en dev/proto)
            ref={recaptchaRef}
          />
        )}


        <button type="submit" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
};


export default Login;



