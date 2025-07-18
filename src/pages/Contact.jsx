import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseClient';
import '../Style/Contact.css';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Veuillez saisir votre nom.';
    if (!formData.email.trim()) {
      newErrors.email = 'Veuillez saisir votre email.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide.';
    }
    if (!formData.message.trim()) newErrors.message = 'Veuillez saisir un message.';
    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);


    if (Object.keys(validationErrors).length === 0) {
      try {
        await addDoc(collection(db, 'messages'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        setSent(true);
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
      }
    }
  };


  return (
    <div className="contact-page" role="main" aria-labelledby="contact-title">
      <h1 id="contact-title">Contactez-nous</h1>


      {sent && <p className="success-msg">✅ Merci pour votre message !</p>}


      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "error-name" : null}
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom complet"
          />
          {errors.name && <span id="error-name" role="alert" className="error-msg">{errors.name}</span>}
        </div>


        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "error-email" : null}
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@domaine.com"
          />
          {errors.email && <span id="error-email" role="alert" className="error-msg">{errors.email}</span>}
        </div>


        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            aria-required="true"
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "error-message" : null}
            value={formData.message}
            onChange={handleChange}
            placeholder="Votre message"
          />
          {errors.message && <span id="error-message" role="alert" className="error-msg">{errors.message}</span>}
        </div>


        <button type="submit" aria-label="Envoyer le message">Envoyer</button>
      </form>
    </div>
  );
};


export default Contact;

