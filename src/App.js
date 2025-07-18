import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';


// 📄 Pages publiques
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Testimonials from './pages/Testimonials';
import Login from './pages/Login1.jsx';
import Reservation from './pages/Reservation1.jsx';
import Chefs from './pages/Chefs';


// 🔐 Dashboards (admin + employés)
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import GestionEmployes from './pages/GestionEmployes.jsx';
import GestionPlats from './pages/GestionPlats.jsx';
import DashboardEmploye from './pages/DashboardEmploye.jsx';
import GestionAvis from './pages/GestionAvis';
import GestionReservations from './pages/GestionReservations';
import GestionMessages from './pages/GestionMessages';
import ModifierContenuSite from './pages/ModifierContenuSite';


// 📦 Composants globaux
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BoutonRetour from './components/BoutonRetour.jsx';


// 🔐 Auth context
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Pour déterminer la page courante


  useEffect(() => {
    if (token && user?.role) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'maitre_hotel':
        case 'chef_cuisine':
        case 'gestionnaire_contenu':
        case 'responsable_salle':
          navigate('/employe/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [token, user, navigate]);


  // ✅ Pages où on ne veut PAS afficher le bouton retour
  const pagesSansBoutonRetour = ['/', '/login'];


  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh' }}>

		 {/* ✅ Bouton retour global sauf sur certaines pages */}
 {!pagesSansBoutonRetour.includes(location.pathname) && (
          <BoutonRetour />
        )}
        <Routes>
          {/* 🌐 Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/chefs" element={<Chefs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/avis" element={<Testimonials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reservation" element={<Reservation />} />



          {/* 🔐 Dashboard Employé */}
          <Route path="/employe/dashboard" element={
            <ProtectedRoute>
              <DashboardEmploye />
            </ProtectedRoute>
          } />


          {/* 🔐 Dashboard ADMIN */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/employes" element={
            <ProtectedRoute>
              <GestionEmployes />
            </ProtectedRoute>
          } />
          <Route path="/admin/plats" element={
            <ProtectedRoute>
              <GestionPlats />
            </ProtectedRoute>
          } />
          <Route path="/admin/avis" element={
            <ProtectedRoute>
              <GestionAvis />
            </ProtectedRoute>
          } />
          <Route path="/admin/reservations" element={
            <ProtectedRoute>
              <GestionReservations />
            </ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute>
              <GestionMessages />
            </ProtectedRoute>
          } />
          <Route path="/admin/contenu-site" element={
            <ProtectedRoute>
              <ModifierContenuSite />
            </ProtectedRoute>
          } />
        </Routes>


        {/* ✅ Composants globaux toujours visibles */}
        <ScrollToTop />


       
      </main>
      <Footer />
    </>
  );
}


export default App;

