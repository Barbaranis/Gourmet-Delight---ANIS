import React, { useEffect, useState } from 'react';
import { db } from '../firebaseClient';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import '../Style/GestionAvis.css';


const GestionAvis = () => {
  const [temoignages, setTemoignages] = useState([]);


  const fetchTemoignages = async () => {
    try {
      const q = query(collection(db, 'temoignages'), where('validated', '==', false));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTemoignages(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
    }
  };


  useEffect(() => {
    fetchTemoignages();
  }, []);


  const validerTemoignage = async (id) => {
    try {
      const ref = doc(db, 'temoignages', id);
      await updateDoc(ref, { validated: true });
      setTemoignages(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erreur lors de la validation :", err);
    }
  };


  const refuserTemoignage = async (id) => {
    try {
      const ref = doc(db, 'temoignages', id);
      await updateDoc(ref, { validated: false, refused: true });
      setTemoignages(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erreur lors du refus :", err);
    }
  };


  return (
    <div className="admin-avis">
      <h2>Validation des témoignages</h2>


      {temoignages.length === 0 ? (
        <p>Aucun avis en attente.</p>
      ) : (
        <ul>
          {temoignages.map(({ id, name, content, stars }) => (
            <li key={id} className="avis-item">
              <p><strong>{name || "Anonyme"}</strong> — {Array.from({ length: stars }).map(() => "⭐").join("")}</p>
              <p>{content}</p>
              <div className="buttons">
                <button onClick={() => validerTemoignage(id)}>✅ Valider</button>
                <button className="refuser" onClick={() => refuserTemoignage(id)}>❌ Refuser</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default GestionAvis;

