//src/pages/GestionAvis.jsx






import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebaseClient';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import DOMPurify from 'dompurify'; // 🔐 Sécurité : pour nettoyer les contenus HTML injectés
import '../Style/GestionAvis.css';


const GestionAvis = () => {
  const [temoignages, setTemoignages] = useState([]);
  const [filtrePlat, setFiltrePlat] = useState('');
  const [filtreDate, setFiltreDate] = useState('');


  // 🔄 Récupération des témoignages non validés depuis Firestore
  const fetchTemoignages = useCallback(async () => {
    try {
      const q = query(collection(db, 'temoignages'), where('validated', '==', false));
      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


      // 🔍 Filtres : plat ou date
      if (filtrePlat) {
        data = data.filter(t =>
          t.platConcerné?.toLowerCase().includes(filtrePlat.toLowerCase())
        );
      }
      if (filtreDate) {
        data = data.filter(t => {
          const date = new Date(t.dateSoumission?.toDate()).toISOString().split('T')[0];
          return date === filtreDate;
        });
      }


      setTemoignages(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis :", error);
    }
  }, [filtrePlat, filtreDate]);


  useEffect(() => {
    fetchTemoignages();
  }, [fetchTemoignages]);


  // ✅ Marquer un témoignage comme validé
  const validerTemoignage = async (id) => {
    try {
      const ref = doc(db, 'temoignages', id);
      await updateDoc(ref, { validated: true });
      setTemoignages(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erreur lors de la validation :", err);
    }
  };


  // ❌ Refuser un témoignage
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
      <h2>🛡️ Validation des témoignages</h2>


      {/* 🔍 Filtres pour trier les témoignages */}
      <div className="filtres">
        <input
          type="text"
          placeholder="Filtrer par plat"
          value={filtrePlat}
          onChange={(e) => setFiltrePlat(e.target.value)}
        />
        <input
          type="date"
          value={filtreDate}
          onChange={(e) => setFiltreDate(e.target.value)}
        />
      </div>


      {/* 🔎 Liste des témoignages */}
      {temoignages.length === 0 ? (
        <p>Aucun avis en attente.</p>
      ) : (
        <ul className="liste-avis">
          {temoignages.map(({ id, name, content, stars, platConcerné, dateSoumission }) => (
            <li key={id} className="avis-item">
              <p>
                <strong>{name || "Anonyme"}</strong> — {Array.from({ length: stars }).map(() => "⭐").join("")}
              </p>
              <p><em>Plat : {platConcerné || "Non précisé"}</em></p>


              {/* 🔐 Sécurité XSS : Nettoyage du contenu HTML avec DOMPurify */}
              <div
                className="avis-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
              />


              <p className="date">
                Soumis le : {dateSoumission?.toDate().toLocaleDateString() || "?"}
              </p>


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

