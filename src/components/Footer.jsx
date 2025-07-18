import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/Footer.css';


import facebookIcon from '../assets/facebook.png';
import instagramIcon from '../assets/instagram.png';
import xIcon from '../assets/x.png';
import tiktokIcon from '../assets/tiktok.png';


const Footer = () => {
  return (
    <footer className="footer" role="contentinfo" aria-label="Pied de page du site Gourmet Delight">
      <div className="footer-columns">


        <div className="footer-section">
          <h4>Contact</h4>
          <p><strong>Email :</strong> contact@gourmet-delight.fr</p>
          <p><strong>Téléphone :</strong> 01 25 35 87 29</p>
          <p><strong>Adresse :</strong> 26 rue des Anis, 75007 Paris</p>
        </div>


        <div className="footer-section">
          <h4>Horaires</h4>
          <p>Lun - Ven : 12h - 14h / 19h - 23h</p>
          <p>Sam - Dim : 12h - 00h</p>
        </div>


        <div className="footer-section">
          <h4>Suivez-nous</h4>
          <nav className="social-icons" aria-label="Réseaux sociaux">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (anciennement Twitter)">
              <img src={xIcon} alt="X" />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <img src={tiktokIcon} alt="TikTok" />
            </a>
          </nav>
        </div>


        <div className="footer-section">
          <h4>Navigation</h4>
          <ul className="footer-nav-list">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/chefs">Chefs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/avis">Avis</Link></li>
          </ul>
        </div>


      </div>


      <p className="footer-note">© 2025 Gourmet Delight – L'excellence à la française.</p>
    </footer>
  );
};


export default Footer;

