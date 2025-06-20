import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>Gourmet Delight</h1>
      <div style={styles.links}>
        <Link to="/">Accueil</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#ffe0e6' },
  title: { margin: 0 },
  links: { display: 'flex', gap: '1rem' }
};

export default Navbar;
