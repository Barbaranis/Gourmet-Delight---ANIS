import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Style/NavMenu.css';


const NavMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();


  // Fermer le menu quand la route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  const toggleMenu = () => setMenuOpen(!menuOpen);


  return (
    <>
      {/* Bouton burger (caché si menu ouvert) */}
      <button
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="navigation-mobile"
        style={{ display: menuOpen ? 'none' : 'flex' }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* Navigation mobile */}
      <nav
        id="navigation-mobile"
        className={`nav-menu ${menuOpen ? 'show' : ''}`}
        aria-hidden={!menuOpen}
        aria-label="Menu mobile"
      >
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
        >
          ×
        </button>


        <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
        <Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
        <Link to="/chefs" onClick={() => setMenuOpen(false)}>Chefs</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>À propos</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link to="/avis" onClick={() => setMenuOpen(false)}>Témoignages</Link>
        <Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
      </nav>


      {/* Navigation desktop */}
      <nav className="nav-desktop" aria-label="Navigation principale">
        <Link to="/">Accueil</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/chefs">Chefs</Link>
        <Link to="/about">À propos</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/avis">Témoignages</Link>
        <Link to="/login">Connexion</Link>
      </nav>
    </>
  );
};


export default NavMenu;

