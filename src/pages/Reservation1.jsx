import React, { useState } from 'react';
import '../Style/Reservation.css';
import { db } from '../firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import BoutonRetour from '../components/BoutonRetour';


// ... dans ton JSX :
<BoutonRetour />


const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    message: ''
  });


  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const validate = () => {
    const newErrors = {};


    if (!/^[a-zA-ZÀ-ÿ' -]{2,30}$/.test(formData.name.trim())) {
      newErrors.name = 'Veuillez entrer un nom valide.';
    }


    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email.trim())) {
      newErrors.email = 'Adresse email invalide.';
    }


    if (!formData.date) newErrors.date = 'Veuillez choisir une date.';
    if (!formData.time) newErrors.time = 'Veuillez choisir une heure.';


    if (!/^[1-9][0-9]?$/.test(formData.guests)) {
      newErrors.guests = 'Entre 1 et 99 personnes.';
    }


    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();


    if (Object.keys(validationErrors).length === 0) {
      try {
        await addDoc(collection(db, 'reservations'), {
          ...formData,
          createdAt: serverTimestamp()
        });


        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          date: '',
          time: '',
          guests: '',
          message: ''
        });
        setErrors({});
      } catch (error) {
        console.error('Erreur Firestore :', error);
        alert("Une erreur s’est produite lors de l’enregistrement.");
      }
    } else {
      setErrors(validationErrors);
    }
  };


  return (
    <main className="reservation-page" role="main" aria-labelledby="reservation-title">
      <h1 id="reservation-title">Réservez votre table</h1>


      {submitted ? (
        <div className="confirmation">
          Merci pour votre réservation ! Nous vous contacterons rapidement.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="reservation-form" noValidate>
          <label htmlFor="name">Nom</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
            aria-invalid={!!errors.name} aria-describedby="name-error" placeholder="Jean Dupont" />
          {errors.name && <span id="name-error" role="alert" className="error">{errors.name}</span>}


          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
            aria-invalid={!!errors.email} aria-describedby="email-error" placeholder="exemple@mail.com" />
          {errors.email && <span id="email-error" role="alert" className="error">{errors.email}</span>}


          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
            aria-invalid={!!errors.date} aria-describedby="date-error" />
          {errors.date && <span id="date-error" role="alert" className="error">{errors.date}</span>}


          <label htmlFor="time">Heure</label>
          <input type="time" id="time" name="time" value={formData.time} onChange={handleChange}
            aria-invalid={!!errors.time} aria-describedby="time-error" />
          {errors.time && <span id="time-error" role="alert" className="error">{errors.time}</span>}


          <label htmlFor="guests">Nombre de personnes</label>
          <input type="number" id="guests" name="guests" min="1" max="99" value={formData.guests}
            onChange={handleChange} aria-invalid={!!errors.guests} aria-describedby="guests-error" placeholder="2" />
          {errors.guests && <span id="guests-error" role="alert" className="error">{errors.guests}</span>}


          <label htmlFor="message">Message (optionnel)</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange}
            placeholder="Allergies, préférences, etc." />


          <button type="submit">Envoyer</button>
        </form>
      )}
    </main>
  );
};


export default Reservation;

