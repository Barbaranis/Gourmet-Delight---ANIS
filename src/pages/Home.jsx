import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseClient';
import '../Style/Home.css';
import BoutonRetour from '../components/BoutonRetour';


// ✅ IMPORT IMAGES
import entreeImage from '../assets/entrees.jpg';
import vinsImage from '../assets/VINS.jpg';
import dessertsImage from '../assets/desserts.jpg';


const Home = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const [contenu, setContenu] = useState({
    accueilIntroTitre: '',
    accueilIntroTexte: '',
    reservationTexte: ''
  });


  const introRef = useRef();
  const specialtiesRef = useRef();
  const reservationRef = useRef();
  const testimonialsRef = useRef();


  useEffect(() => {
    const fetchContenu = async () => {
      const docRef = doc(db, 'contenuSite', 'Principal');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContenu(docSnap.data());
      }
    };


    fetchContenu();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      const newVisible = {};
      [
        { ref: introRef, name: 'intro' },
        { ref: specialtiesRef, name: 'specialties' },
        { ref: reservationRef, name: 'reservation' },
        { ref: testimonialsRef, name: 'testimonials' },
      ].forEach(({ ref, name }) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        let opacity = 0;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          opacity = visibleHeight / rect.height;
        }
        newVisible[name] = opacity;
      });
      setVisibleSections(newVisible);
    };


    window.addEventListener('scroll', handleScroll);
    handleScroll();


    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <main>
      <BoutonRetour />


      {/* HERO SECTION */}
      <section className="hero-banner" role="banner" aria-label="Présentation du restaurant">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Gourmet Delight</h1>
          <p>Un voyage gastronomique inoubliable vous attend</p>
        </div>
      </section>


      {/* INTRODUCTION */}
      <section
        className={`intro section ${visibleSections.intro > 0.3 ? 'visible' : ''}`}
        ref={introRef}
        aria-labelledby="intro-heading"
      >
        <div className="intro-text">
          <h2 id="intro-heading">{contenu.accueilIntroTitre}</h2>
          <p>{contenu.accueilIntroTexte}</p>
        </div>
      </section>


      {/* SPÉCIALITÉS */}
      <section
        className={`specialties section ${visibleSections.specialties > 0.3 ? 'visible' : ''}`}
        ref={specialtiesRef}
        aria-labelledby="specialties-heading"
      >
        <div className="container">
          <h2 id="specialties-heading" className="specialties-title">Nos Spécialités</h2>
          <div className="specialties-grid">
            <div className="specialty-card">
              <img src={entreeImage} alt="Assiette d'entrées raffinées" className="specialty-img" />
              <div className="specialty-content">
                <h3>Entrées Raffinées</h3>
                <p>Des créations légères et élégantes pour éveiller vos papilles dès la première bouchée.</p>
              </div>
            </div>
            <div className="specialty-card">
              <img src={vinsImage} alt="Sélection de vins gastronomiques" className="specialty-img" />
              <div className="specialty-content">
                <h3>Sélection de Vins</h3>
                <p>Une carte des vins soigneusement sélectionnée pour accompagner chaque moment culinaire.</p>
              </div>
            </div>
            <div className="specialty-card">
              <img src={dessertsImage} alt="Dessert au chocolat noir et fruits rouges" className="specialty-img" />
              <div className="specialty-content">
                <h3>Desserts d'Exception</h3>
                <p>Des douceurs artisanales pour conclure votre repas avec élégance et gourmandise.</p>
              </div>
            </div>
          </div>
          <Link to="/menu" className="menu-button" aria-label="Voir le menu complet">
            Voir le menu complet
          </Link>
        </div>
      </section>


      {/* RÉSERVATION */}
      <section
        className={`reservation section ${visibleSections.reservation > 0.3 ? 'visible' : ''}`}
        ref={reservationRef}
        aria-labelledby="reservation-heading"
      >
        <h2 id="reservation-heading">Réservation en ligne</h2>
        <p>{contenu.reservationTexte}</p>
        <Link to="/reservation" className="reservation-button" role="button">
          Réserver maintenant
        </Link>
      </section>


      {/* TÉMOIGNAGES */}
      <section
        className={`testimonials section ${visibleSections.testimonials > 0.3 ? 'visible' : ''}`}
        ref={testimonialsRef}
        aria-labelledby="testimonials-heading"
      >
        <TestimonialsCarousel />
      </section>
    </main>
  );
};


export default Home;

