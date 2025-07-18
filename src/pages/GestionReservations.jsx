import React, { useEffect, useState } from 'react';
import { db } from '../firebaseClient';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../Style/GestionReservations.css';


const GestionReservations = () => {
  const [reservations, setReservations] = useState([]);


  const fetchReservations = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reservations'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };


  const supprimerReservation = async (id) => {
    try {
      await deleteDoc(doc(db, 'reservations', id));
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };


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


  useEffect(() => {
    fetchReservations();
  }, []);


  return (
    <div className="gestion-reservations">
      <h2>📅 Réservations</h2>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Date</th>
            <th>Personnes</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(({ id, name, email, date, guests, valide }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{email}</td>
              <td>{date}</td>
              <td>{guests}</td>
              <td>{valide ? '✅ Validée' : '⏳ En attente'}</td>
              <td className="action-buttons">
                {!valide && (
                  <button className="validate" onClick={() => validerReservation(id)}>Valider</button>
                )}
                <button className="delete" onClick={() => supprimerReservation(id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default GestionReservations;

