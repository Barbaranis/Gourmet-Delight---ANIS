// src/pages/Menu.jsx
// Petite modif pour déclencher Netlify


import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import '../Style/Menu.css';

const CATEGORIES = {
  1: 'Entrées',
  2: 'Plats',
  3: 'Desserts',
  4: 'Boissons',
};

export default function Menu() {
  const [menuData, setMenuData] = useState({});
  const [activeTab, setActiveTab] = useState('Entrées');

  useEffect(() => {
    api.get('/api/plats')
      .then((res) => {
        const grouped = {};
        res.data.forEach((plat) => {
          const nomCat = CATEGORIES[plat.id_categorie] || 'Autres';
          if (!grouped[nomCat]) grouped[nomCat] = [];

          grouped[nomCat].push({
            id: plat.id_plat,
            name: plat.nom,
            description: plat.description,
            price: `${plat.prix}€`,
            image_url: plat.image_url ? `http://localhost:3000/uploads/${plat.image_url}` : null,
          });
          
        });
        setMenuData(grouped);
      })
      .catch((err) => console.error("❌ Erreur chargement menu :", err));
  }, []);

  return (
    <main className="menu-container">
      <section className="menu-intro">
        <h1>Découvrez nos plats</h1>
        <p>
          Savourez une sélection exquise de mets raffinés, préparés avec passion par nos chefs talentueux.
          Naviguez parmi nos catégories et laissez-vous tenter par l’exception gastronomique.
        </p>
      </section>

      <nav className="menu-tabs" aria-label="Catégories du menu">
        {Object.keys(menuData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={activeTab === category ? 'active' : ''}
            aria-selected={activeTab === category}
            role="tab"
          >
            {category}
          </button>
        ))}
      </nav>

      <section
        className="menu-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {menuData[activeTab] ? (
          menuData[activeTab].map(({ id, name, description, price, image_url }) => (
            <article key={id} className="menu-item">
              {image_url && (
                <img
                  src={image_url}
                  alt={`Photo de ${name}`}
                  className="menu-item-image"
                />
              )}
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
              <div className="menu-price">{price}</div>
            </article>
          ))
        ) : (
          <p>Chargement des plats...</p>
        )}
      </section>
    </main>
  );
}

