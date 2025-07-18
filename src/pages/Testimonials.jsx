//src/pages/Testimonials.jsx




import React, { useState } from 'react';
import { db } from '../firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import '../Style/Testimonials.css';


const Testimonials = () => {
  const [form, setForm] = useState({ name: '', content: '', stars: 5 });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);


  const validate = () => {
    const errs = {};
    if (!form.content.trim()) errs.content = 'Le texte est obligatoire.';
    if (form.name && !/^[\p{L}\s'-]{2,30}$/u.test(form.name.trim()))
      errs.name = 'Prénom invalide (lettres, espaces, 2-30 caractères).';
    if (form.stars < 1 || form.stars > 5) errs.stars = 'Note invalide.';
    return errs;
  };


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'stars' ? Number(value) : value
    }));
  };


  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }


    const newTestimonial = {
      name: form.name.trim() || 'Anonyme',
      content: form.content.trim(),
      stars: form.stars,
      createdAt: new Date(),
      validated: false,
    };


    try {
      await addDoc(collection(db, 'temoignages'), newTestimonial);
      setForm({ name: '', content: '', stars: 5 });
      setErrors({});
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur Firestore :", err);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  };


  return (
    <section className="testimonial-form-section">
      <h2>Laissez votre témoignage</h2>


      {submitted ? (
        <p className="success-message">
          Merci pour votre avis ! Il sera publié après validation.
        </p>
      ) : (
        <form className="testimonial-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Prénom (optionnel)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Votre prénom"
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="error">{errors.name}</span>}


          <label htmlFor="content">Votre avis *</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Votre message ici..."
            required
            rows={4}
            aria-invalid={!!errors.content}
          />
          {errors.content && <span className="error">{errors.content}</span>}


          <label htmlFor="stars">Votre note *</label>
          <select
            id="stars"
            name="stars"
            value={form.stars}
            onChange={handleChange}
            required
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>
          {errors.stars && <span className="error">{errors.stars}</span>}


          <button type="submit">Envoyer</button>
        </form>
      )}
    </section>
  );
};


export default Testimonials;

