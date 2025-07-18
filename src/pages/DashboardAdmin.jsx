//src/pages/DashboardAdmin.jsx

import React, { useEffect, useState } from 'react';
import '../Style/DashboardAdmin.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';


const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [avisCount, setAvisCount] = useState(0);


  const handleNavigation = (path) => {
    navigate(path);
  };


  useEffect(() => {
    const fetchAvisNonValides = async () => {
      try {
        const q = query(collection(db, 'temoignages'), where('validated', '==', false));
        const snapshot = await getDocs(q);
        setAvisCount(snapshot.size);
      } catch (err) {
        console.error('Erreur lors du chargement des avis en attente :', err);
      }
    };


    fetchAvisNonValides();
  }, []);


  return (
    <div className="dashboard-admin">
      <h1 className="dashboard-title">Tableau de bord – Administrateur</h1>


      <div className="dashboard-grid">
        <button onClick={() => handleNavigation('/admin/employes')}>
          👤 Gérer les employés
        </button>
        <button onClick={() => handleNavigation('/admin/plats')}>
          🍽️ Gérer les plats
        </button>
        <button onClick={() => handleNavigation('/admin/reservations')}>
          📅 Gérer les réservations
        </button>
        <button onClick={() => handleNavigation('/admin/messages')}>
          ✉️ Voir les messages
        </button>
        <button onClick={() => handleNavigation('/admin/avis')}>
          💬 Gérer les avis clients
          {avisCount > 0 && (
            <span className="badge-avis">{avisCount}</span>
          )}
        </button>
        <button onClick={() => handleNavigation('/admin/contenu-site')}>
          📝 Modifier le contenu du site
        </button>
      </div>
    </div>
  );
};


export default DashboardAdmin;



