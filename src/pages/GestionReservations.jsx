// src/pages/GestionReservations.jsx


import React, { useEffect, useState } from 'react';
import { db } from '../firebaseClient';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../Style/GestionReservations.css';


const GestionReservations = () => {
  const [reservations, setReservations] = useState([]);


  // 🔐 Chargement sécurisé des réservations depuis Firestore
  const fetchReservations = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reservations'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err); // 🔎 Logging utile en cas de debug
    }
  };


  // 🗑️ Suppression sécurisée d'une réservation
  const supprimerReservation = async (id) => {
    if (!window.confirm("Confirmez-vous la suppression de cette réservation ?")) return;


    try {
      await deleteDoc(doc(db, 'reservations', id));
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };


  // ✅ Validation sécurisée d'une réservation
  const validerReservation = async (id) => {
    try {
      await updateDoc(doc(db, 'reservations', id), { valide: true });
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, valide: true } : r)
      );
    } catch (err) {
      console.error("Erreur validation :", err);
    }
  };


  // 🔄 Chargement au montage
  useEffect(() => {
    fetchReservations();
  }, []);


  return (
    <div className="gestion-reservations" role="main" aria-labelledby="gestion-reservations-title">
      <h2 id="gestion-reservations-title">📅 Réservations</h2>


      {/* 📋 Table responsive et accessible */}
      <table className="reservations-table" role="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Email</th>
            <th scope="col">Date</th>
            <th scope="col">Personnes</th>
            <th scope="col">Statut</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>


        <tbody>
          {reservations.map(({ id, name, email, date, guests, valide }) => (
            <tr key={id}>
              <td>{name}</td>
              <td><a href={`mailto:${email}`} aria-label={`Envoyer un mail à ${email}`}>{email}</a></td>
              <td>{date}</td>
              <td>{guests}</td>
              <td>
                <span
                  className={valide ? 'statut valide' : 'statut attente'}
                  role="status"
                  aria-label={valide ? 'Réservation validée' : 'Réservation en attente'}
                >
                  {valide ? '✅ Validée' : '⏳ En attente'}
                </span>
              </td>


              {/* 🎯 Boutons accessibles et sécurisés */}
              <td className="action-buttons">
                {!valide && (
                  <button
                    className="validate"
                    onClick={() => validerReservation(id)}
                    aria-label={`Valider la réservation de ${name}`}
                  >
                    Valider
                  </button>
                )}
                <button
                  className="delete"
                  onClick={() => supprimerReservation(id)}
                  aria-label={`Supprimer la réservation de ${name}`}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default GestionReservations;

