import React, { useEffect, useState } from 'react';
import { db } from '../firebaseClient';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../Style/GestionReservations.css';


const GestionReservations = () => {
  const [reservations, setReservations] = useState([]);


  // 🔐 SÉCURITÉ : Chargement sécurisé des données Firestore
  const fetchReservations = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reservations'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(data);


      // 🔐 SÉCURITÉ UX : on marque les réservations comme "vues" pour désactiver le badge
      localStorage.setItem('reservations_seen', 'true');
    } catch (err) {
      // 🔐 LOGGING d’erreur en cas de souci Firestore
      console.error("Erreur lors du chargement des réservations :", err);
    }
  };


  // 🔐 SÉCURITÉ : Demande de confirmation avant suppression
  const supprimerReservation = async (id) => {
    if (!window.confirm("Confirmez-vous la suppression de cette réservation ?")) return;


    try {
      await deleteDoc(doc(db, 'reservations', id));
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };


  // 🔐 SÉCURITÉ : Mise à jour Firestore de façon contrôlée
  const validerReservation = async (id) => {
    try {
      await updateDoc(doc(db, 'reservations', id), { valide: true });
      setReservations(prev =>
        prev.map(r => r.id === id ? { ...r, valide: true } : r)
      );
    } catch (err) {
      console.error("Erreur lors de la validation :", err);
    }
  };


  // 📥 CHARGEMENT au montage du composant
  useEffect(() => {
    fetchReservations();
  }, []);


  return (
    // ♿ ACCESSIBILITÉ : rôle="main" + aria-labelledby
    <div className="gestion-reservations" role="main" aria-labelledby="titre-reservations">
      <h2 id="titre-reservations">📅 Réservations</h2>


      {/* ♿ ACCESSIBILITÉ : conteneur de la table avec région nommée */}
      <div className="table-container" role="region" aria-label="Liste des réservations">
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
                <td>
                  {/* ♿ ACCESSIBILITÉ : description explicite pour les lecteurs d’écran */}
                  <a href={`mailto:${email}`} aria-label={`Contacter ${email}`}>{email}</a>
                </td>
                <td>{date}</td>
                <td>{guests}</td>
                <td>
                  {/* ♿ ACCESSIBILITÉ : indication du statut pour lecteurs d’écran */}
                  <span
                    className={valide ? 'statut valide' : 'statut attente'}
                    role="status"
                    aria-label={valide ? 'Réservation validée' : 'Réservation en attente'}
                  >
                    {valide ? '✅ Validée' : '⏳ En attente'}
                  </span>
                </td>
                <td className="action-buttons">
                  {/* ♿ ACCESSIBILITÉ : bouton explicite + sécurité d’action */}
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
    </div>
  );
};


export default GestionReservations;


